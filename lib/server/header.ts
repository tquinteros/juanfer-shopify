'use server'

import { shopifyFetch } from '@/lib/shopify'
import { GET_MENU_BY_HANDLE_QUERY } from '@/lib/queries'
import { MenuByHandleQuery, MenuByHandleQuerySchema } from '@/lib/types/shopify'

interface GetMenuByHandleParams {
    handle: string
    language?: string
}

export async function getMenuByHandleAction(
    params: GetMenuByHandleParams
): Promise<MenuByHandleQuery> {
    const { handle, language = 'ES' } = params

    try {
        const data = await shopifyFetch<MenuByHandleQuery>({
            query: GET_MENU_BY_HANDLE_QUERY,
            variables: { handle },
            language,
        })

        return MenuByHandleQuerySchema.parse(data)
    } catch (error) {
        console.error('Error fetching menu by handle:', error)
        throw new Error('Failed to fetch menu by handle')
    }
}