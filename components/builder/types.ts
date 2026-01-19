export interface BuilderData {
    floorArea: number;
    wallArea: number;
    color: ColorOption | null;
    finish: 'matte' | 'satin' | null;
}

export interface ColorOption {
    id: string;
    label: string;
    image: string;
}

export const AVAILABLE_COLORS: ColorOption[] = [
    {
        id: 'green',
        label: 'Green',
        image: '/greencolor.png'
    }
];

