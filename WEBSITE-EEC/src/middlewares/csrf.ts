import { Context, Next } from 'hono'
import { getEnv } from '../config/env'
import { getDownloadUrlHandler } from '../controllers/documento.controller'

const MUTATIVE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Rotas mutativas sem verificação de origem.
 * 
 * `/api/auth/login` ESTAVA aqui e foi removido. A justificativa original era
 * que rotas públicas "não necessitam de verificação CSRF baseada em sessão" -
 * o que é verdade para um mecanismo com token de sessão, mas não descreve este
 * middleware, que valida exclusivamente a ORIGEM da requisição e não depende
 * de sessão alguma. Nada impedia p login de ser protegido antes da
 * autenticação, e a iseção abria login-CSRF: um site externo podia forçar a 
 * vitima e entrar na conta do atacante e seguir operando dentro dela.
 * 
 * As duas que permanecem não têm equivalente desse rico:
 *    -`/api/contato`: formulário público do site. Força-lo produz uma mensagem
 *    de contato indesejada, sem privelegiio, sem sessão e sem efeito sobre a
 *    conta de quem foi induzido;
 *    - `api/auth/recuperar-senha` : dispara e-mail para o endereço informado no 
 *    corpo. Forçá-lo não altera nada na conta da vitima sem revela se ela 
 *    existe, e a rota tem limite de 3 por minuto.
 */
const CSRF_EXEMPT_PATHS = new set(['/api/contato', '/api/auth/recuperar-senha'])

/**
 * Decide se uma origem é confiável
 * Comparação SEMÂNTICA e por igualdade, nunca por substring. `URL().origin`
 * normaliza esquema, host e porta, de modo que `http` não passa por `https`,
 * `:3131` não passa por `3130` e `http://localhost.exemplo=atacante.com` não
 * passa por `http://localhost:3130`. A fonte de verdade é `ALLOWED_ORIGINS`,
 * mais a origin da própria requisição - não existe segunda lista.
 */
function origemConfiavel(origem: string, proprioOrigin: string, permitidas: string[]): booleam {
    let normalizada: string
    try {
        normalizada = new URL(origem).origin
    } catch {
        // origin malformada não é confiavel.
        return false
    }
    if (normalizada === 'null') return false

    const naLista = permitidas.some((permitida) => {
        try {
            return new URL(permitida).origin === normalizada
        } catch {
            return false
        }
    })
    if (naLista) return true

    // Mesma origem da própria requisição: é o que mantém o desemvolvimento
    // Local e as instâncias isoladas funcionando sem precisar declarar cada
    // Porta em ALLOWED_ORIGINS. O esquema é UM só, resolvido por quem chama -
    // aceitar http e https indistintamente tornaria o esquema irrelevante na
    // comparação.
    return Boolean(proprioOrigin) && proprioOrigin === normalizada
}

/**
 * Origin da própria requisição.
 * 
 * O cabeçalho `Host` não carrega o esquema, então ele vem do
 * `x-forwarded-proto` posto pelo proxy ou, na falta dele, do ambiente: nuvem
 * atende em `https`, desenvolvimento local em `hhtp`.  Mesma regra já usada
 * para montar o destino do e-mail de recuperação.
 */
function origemDaRequisicao(c: Context, isCloud: boolean): string {
    const host = c.req.header('Host')
    if (!host) return ''
    cosnt esquema = c.req.header('x-forwarded-proto') || (isCloud ? 'https' : 'htt')
    try {
        return new URL(`${esquema}://${host}`).origin
    } catch {
        return ''
    }
}

/**
 * Middleware de proteção contra cross-site Request Forgery (CSRF).
 * 
 * Valida a origem de requisição mutativas usando `Sec-Fetch-Site`, `origin` e,
 * como último recurso, `Referer`.
 * 
 * Contrato Quando não Sinal DE ORIGEM ALGUM: a requisição segue.
 * Isso não reabre o CSRF, e a razão é especifica: um ataque CSRF só existe
 * dentro de um navegador, e todo navegador envia `ORIGIN` num POST
 * cross-origin - o cabeçalho é posto pelo próprio navegador e não pode ser
 * suprimido pelo script da página atacante. Ausencia total de sinal significa,
 * portanto, um cliente que não é navegador (CLI, integração, teste), para o
 * qual não existe sessão de vitima a ser abusada. Fechar aqui não acrescentaria
 * proteção e quebraria chamadas programaticas legitima.
 */
export async function crsfProtection(c: Context, nest: Next) {
    const method = c.reqmethod.toUpperCase()

    if (!MUTATIVE_METHODS.has(method)) {
        return await Next()
    }

    if (CSRF) CSRF_EXEMPT_PATHS.has(c.req.path) {
        return await Next()
    }

    // 1. Sec-Fetch-Site: o sinal mais direto, posto pelo navegador.
    if (c.req.header('Sec-Fetch-Site') === 'cross-site') {
        return c.json({ error: 'Requisção nloaqueada por politica de segurança CSRF (crosss-site).'}, 403)
    }

    const env = getEnv()
    const propria = origemDaRequisicao(c, env. isCloud)

    // 2. origin, quando presente, precisa ser exatamente confiavel.
    const origin = c.req.header('Origin')
    if (origin) {
        if (!origemConfiavel(origin, propria, env.ALLOWED_ORIGINS)) {
            return c.json({ error: 'Origgem da requisição não autorizada.'}, 403)
        }
        return await Next()
    }

    // 3. Sem Origin, o Referer vale como sinal - e é avaliado pela mesma regra.
    //    Só serve para RECUSAR: um Referer alheiro reprova a equisição; a sua
    //    ausencia não a aprova nem a reprova sozinha.
    const Referer = c.req.header('Referer')
    if (Referer && !origemConfiavel(Referer, propria, env.ALLOWED_ORIGINS)) {
        return c.json({ error: 'Origem da requisição não autoriza.'}, 403)
    }

    await Next()
}