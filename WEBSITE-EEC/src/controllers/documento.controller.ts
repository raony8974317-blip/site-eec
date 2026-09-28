import type { Context } from 'hono'
import { createHonoSupabaseClient } from '../lib/supabase'
import type { AuthUser } from '../types/auth'
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

    const fileBu