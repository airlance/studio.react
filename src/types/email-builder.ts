export type BlockType =
    | 'heading'
    | 'text'
    | 'image'
    | 'button'
    | 'divider'
    | 'spacer'
    | 'html'
    | 'social'
    | 'conditional'
    | 'hero'
    | 'product-card'
    | 'coupon'
    | 'survey'
    | 'timer'
    | 'video';

export type ColumnLayout = 1 | 2 | 3;

export interface BlockBase {
    id: string;
    type: BlockType;
}

export interface HeadingBlock extends BlockBase {
    type: 'heading';
    content: string;
    level: 'h1' | 'h2' | 'h3';
    color: string;
    align: 'left' | 'center' | 'right';
}

export interface TextBlock extends BlockBase {
    type: 'text';
    content: string;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BlockBase {
    type: 'image';
    src: string;
    alt: string;
    href?: string;
    width: number;
    align: 'left' | 'center' | 'right';
}

export interface ButtonBlock extends BlockBase {
    type: 'button';
    text: string;
    url: string;
    bgColor: string;
    textColor: string;
    borderRadius: number;
    align: 'left' | 'center' | 'right';
}

export interface DividerBlock extends BlockBase {
    type: 'divider';
    color: string;
    thickness: number;
    style: 'solid' | 'dashed' | 'dotted';
}

export interface SpacerBlock extends BlockBase {
    type: 'spacer';
    height: number;
}

export interface HtmlBlock extends BlockBase {
    type: 'html';
    content: string;
}

export interface SocialLink {
    id: string;
    network: string;
    url: string;
}

export interface SocialBlock extends BlockBase {
    type: 'social';
    links: SocialLink[];
    iconSize: number;
    iconColor: 'brand' | 'black' | 'white' | 'custom';
    customColor: string;
    align: 'left' | 'center' | 'right';
    gap: number;
}

import type { ConditionalOperator } from '@/config/personalization';
export type { ConditionalOperator } from '@/config/personalization';

export interface ConditionalBlock extends BlockBase {
    type: 'conditional';
    variable: string;
    operator: ConditionalOperator;
    value: string;
    ifBlocks: EmailBlock[];
    elseBlocks: EmailBlock[];
}

export interface HeroBlock extends BlockBase {
    type: 'hero';
    imageUrl: string;
    imageAlt: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    titleColor: string;
    textColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    align: 'left' | 'center' | 'right';
}

export interface ProductCardBlock extends BlockBase {
    type: 'product-card';
    imageUrl: string;
    imageAlt: string;
    name: string;
    description: string;
    price: string;
    oldPrice: string;
    buttonText: string;
    buttonUrl: string;
    titleColor: string;
    textColor: string;
    priceColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    align: 'left' | 'center' | 'right';
}

export interface CouponBlock extends BlockBase {
    type: 'coupon';
    title: string;
    code: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    bgColor: string;
    borderColor: string;
    titleColor: string;
    textColor: string;
    codeBgColor: string;
    codeTextColor: string;
    align: 'left' | 'center' | 'right';
}

// ---------------------------------------------------------------------------
// Survey / Rating block
// ---------------------------------------------------------------------------

export type SurveyType = 'stars' | 'nps' | 'thumbs';

export interface SurveyBlock extends BlockBase {
    type: 'survey';
    surveyType: SurveyType;
    question: string;
    baseUrl: string;
    starCount: number;
    starColor: string;
    textColor: string;
    labelLow: string;
    labelHigh: string;
    align: 'left' | 'center' | 'right';
}

// ---------------------------------------------------------------------------
// Timer / Countdown block
// ---------------------------------------------------------------------------

export interface TimerBlock extends BlockBase {
    type: 'timer';
    /** ISO 8601 datetime — e.g. "2025-12-31T23:59" */
    deadline: string;
    bgColor: string;
    /** Background of each digit cell */
    digitBgColor: string;
    /** Text color of the digit numbers */
    digitColor: string;
    /** Text color of the unit labels (DAYS, HOURS…) */
    labelColor: string;
    /** Color of the : separator between units */
    separatorColor: string;
    align: 'left' | 'center' | 'right';
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
    labels: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    };
}

// ---------------------------------------------------------------------------
// Video block
// ---------------------------------------------------------------------------

export interface VideoBlock extends BlockBase {
    type: 'video';
    /** Full YouTube / Vimeo / any video URL — used as the link target */
    url: string;
    /** Thumbnail image URL (auto-filled from YouTube, override if needed) */
    thumbnailUrl: string;
    altText: string;
    align: 'left' | 'center' | 'right';
    showPlayButton: boolean;
    /** Fill color of the ▶ icon */
    playButtonColor: string;
    /** Background circle color behind the ▶ icon */
    playButtonBgColor: string;
    /** Width as percentage of the content area */
    width: number;
}

// ---------------------------------------------------------------------------

export type EmailBlock =
    | HeadingBlock
    | TextBlock
    | ImageBlock
    | ButtonBlock
    | DividerBlock
    | SpacerBlock
    | HtmlBlock
    | SocialBlock
    | ConditionalBlock
    | HeroBlock
    | ProductCardBlock
    | CouponBlock
    | SurveyBlock
    | TimerBlock
    | VideoBlock;

export interface EmailRow {
    id: string;
    columns: ColumnLayout;
    blocks: EmailBlock[][];
}

export interface EmailTemplate {
    rows: EmailRow[];
    bgColor: string;
    contentWidth: number;
    fontFamily: string;
}