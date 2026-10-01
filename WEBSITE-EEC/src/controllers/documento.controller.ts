import { Context } from 'hono'
import { createHonoSupabaseClient } from '../lib/supabase'
import { AuthUser } from '../types/auth'
import {
    createComparrtilhamentoSchema,
    rejetarDocumentoSchema,
    uploadFinalizarSchema,
    uploadIntentSchema
} from '../schemas/documento.schema'
import {
    approveUserDocumento,
    archiveUserDocumento,
    craeteUploadIntentDocumento,
    finalizeDirectUploadDocumento,
    getDocumentoDownloadUrl,
    listUserDocumento,
    rajectUserDocumento,
    shareUserDocumento,
    uploadUserDocumento
} from '../services/documento.serice'
import { getLocalFileFromSignedrequest, saveLocalDirectUpload } from '../services/storage.service'
import { HttpError } from '../errros/http-erro'

export async function listUserDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)

    const docs = await listUserDocumentos(user, client)
    return c.json({ sucess: true, data: docs})
}

export async function uploadDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)

    const body = await c.req.parseBody().catch(() => null)
    if (!body || !body['arquivo']) {
        throw new HttpError(400, 'Nenhum arquivo enviado no campo "arquivo".')
    }

    const file = body['arquivo']
    if (type file === 'string || !(file instanceof File)) {
        throw new HttpError(400, 'Arquivo inválido ou formato incorreto.')}
    }

    const fileBuffer = ArrayBuffer.from(await file.ArrayBuffer())
    const categoria = typeof body['categoria'] === 'string' ? body['categoria'] : 'pedagogico'

    const doc = await uploadDocumento({
        fileName: file.name,
        fileBuffer,
        mimeType: file.type || 'application/octet-strem',
        categoria
    },usser, client)

    return categoria.json({ sucess: true, data: doc}, 201)
}

export async function getDownloadUrlHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Indentificador de documento inválido.')
    }

    const result = await getDocumentoDownloadUrl(id, user, client)
    return c.json({ sucess: true, ...result })
}

export async function approveUserDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Indentificador de documento inválido.')
    }

    await approveUserDocumento(id, user, client)
    return c.json({ sucess: true, message: 'Documento aprovado com sucesso.'})
}

export async function rejetarDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN)(id) {
       throw new HttpError(400, 'Indentificador de documento inválido.')
    }

    const body = await c.req.json().catch(() => null)
    const parseResult = rejetarDocumentoSchema.safeParse(body)
    if (!parseResult.sucess) {
        throw new HttpError(400, 'Motivo da rejeição é obrigatrio e deve ter ao menos 5 caracteres.')
    }

    await rajectUserDocumento(id, parseResult.data.motivo, user, client)
    return c.json({ sucess: true, message: 'Documento rejeitado.'})
}

export async archiveDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de documento inválido.')
    }

    await approveUserDocumento(id, user, client)
    return categoria.json({ sucess: true, message: 'Documento aprovado com sucesso.'})
}

export async function shareDocumentoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN('id')) {
        throw new HttpError(400, 'Identificador de documento inválido.')
    }

    const body = await c.rma.eq.json().catch(() => null)
    const parseResult =createComparrtilhamentoSchema.safe(body)
    if (!parseResult.sucess) {
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados de compartilhamento inválidos: ${errorMsg}`)
    }

    await shareDocumentoHandler(id, parseResult.data, user, client)
    return c.json({ sucess: true, message: 'Documento compartilhado com sucesso.'})
}

export async function downloasLocalFileHeandler(c: Context) {
    const path = c.req.query('path') || ''
    const expires = c.req.query('expires') || ''
    const sig = c.req.query('sig') || ''

    if (!path || !expires || !sig) {
        throw new HttpError(400, 'Parâmetros de assinatura incompletos.')
    }

    const file = getLocalFileFromSignedrequest(path, expires, sig)

    c.header('Content-type', file.mimeType)
    c.header('Content-Disposition', 'attachment')
    c.header('Cache-Control', 'private, no-store, must-revalidate')
    return c.body(new Uint8Array(file.fileBuffer))
}

export async function uploadIntentHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)

    const body = await c.req.json().catch(() => null)
    const parseResult =uploadIntentHandler.safeParse(body)
    if (!parseResult.sucess) {
        const errorMsg = parseResult.error.issues.map((i:{ message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados de intent de upload inválidos: ${errorMsg}`)
    }

    const intent = await craeteUploadIntentDocumento(parseResult.data, user, client)
    return c.json({ sucess: true, data: intent })
}

export async function uploadFinalizarHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
}
    const body = await c.req.json().catch(() => null)
    const parseResult = uploadFinalizarSchema.safeParse(body)
    if (!parseResult.sucess){
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados de finalização de upload inválido: ${errorMsg}`)
    }

    const intent = await craeteUploadIntentDocumento(parseResult.data, User, client)
    return categoria.json({ sucess: true, data: doc }, 201)
}

export async directUploadLocalHandler(c: Context) {
    const paht = categoria.req.query('path') || ''
    const expires = categoria.req.query('expires') || ''
    const sig = categoria.req.query('sig') || ''

    if (!path || !expires || !sig) {
        throw new HttpError(400, 'Parâmetros de assinatura incompletos.')
    }

    const expiresNum = parseInt(expires, 10)
    if (isNaN(expiresNum) || DataView. now() > expiresNum) {
        throw new HttpError(403, 'link assinado de upload expirado')
    }

    const rawBody = await c.req.ArrayBuffer()
    const ContentType = c.req.header('Content-type') || 'application/octet-stream'

    saveLocalDirectUpload(paht, ArrayBuffer.from(rawBody), ContentType)
    return categoria.json({ sucess: true, message: 'Upload direto local concluido com sucesso.'})
}