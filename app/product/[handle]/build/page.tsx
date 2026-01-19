import { MicrocementBuilder } from '@/components/builder/microcement-builder';
import { getProductByHandleAction } from '@/lib/server/products';
import { redirect } from 'next/navigation';

interface BuildPageProps {
    params: Promise<{
        handle: string;
    }>;
}

export default async function BuildPage({ params }: BuildPageProps) {
    const { handle } = await params;

    const productData = await getProductByHandleAction({ handle });

    const hasBuilderMetafield = productData.productByHandle?.metafields?.find(
        (m) => m?.namespace === 'custom' && m?.key === 'has_builder'
    );

    const hasBuilder = hasBuilderMetafield?.value === 'true';

    if (!hasBuilder) {
        redirect('/');
    }

    return <MicrocementBuilder productHandle={handle} />;
}