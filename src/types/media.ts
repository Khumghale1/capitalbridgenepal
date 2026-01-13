// Media types matching backend Prisma schema

export type MediaType =
  | 'REGISTRATION_CERTIFICATE'
  | 'PAN_CERTIFICATE'
  | 'FINANCIAL_DOCUMENT'
  | 'PITCH_DECK'
  | 'BROCHURE'
  | 'DOCUMENT'
  | 'COMPANY_LOGO'
  | 'GALLERY'
  | 'IMAGE'
  | 'VIDEO'
  | 'YOUTUBE_VIDEO'
  | 'WEBSITE';

export type MediaApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BusinessMedia {
  id: string;
  businessId: string;
  mediaType: MediaType;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string; // BigInt converted to string
  mimeType?: string;
  externalUrl?: string;
  title?: string;
  description?: string;
  displayOrder: number;
  approvalStatus: MediaApprovalStatus;
  rejectionReason?: string;
  uploadedAt: string;
  approvedAt?: string;
}

export interface MediaTypeLimit {
  maxCount: number | null;
  description: string;
}

export interface MediaTypesResponse {
  mediaTypes: MediaType[];
  limits: Record<MediaType, MediaTypeLimit>;
}

export interface MediaUploadResponse {
  message: string;
  media: BusinessMedia;
}

export interface MediaListResponse {
  media: BusinessMedia[] | Record<MediaType, BusinessMedia[]>;
  total?: number;
  summary?: {
    total: number;
    byType: Record<string, number>;
  };
}

// Helper to format file size
export const formatFileSize = (bytes: string | number): string => {
  const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// Media type display names
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  REGISTRATION_CERTIFICATE: 'Company Registration Certificate',
  PAN_CERTIFICATE: 'PAN Certificate',
  FINANCIAL_DOCUMENT: 'Financial Document',
  PITCH_DECK: 'Pitch Deck',
  BROCHURE: 'Brochure',
  DOCUMENT: 'Application Form',
  COMPANY_LOGO: 'Company Logo',
  GALLERY: 'Gallery Image',
  IMAGE: 'Image',
  VIDEO: 'Video',
  YOUTUBE_VIDEO: 'YouTube Video',
  WEBSITE: 'Website Link',
};

// Accepted file types for each media type (for input accept attribute)
export const ACCEPTED_FILE_TYPES: Record<MediaType, string> = {
  REGISTRATION_CERTIFICATE: '.pdf,.jpg,.jpeg,.png',
  PAN_CERTIFICATE: '.pdf,.jpg,.jpeg,.png',
  FINANCIAL_DOCUMENT: '.pdf,.xlsx,.xls',
  PITCH_DECK: '.pdf,.ppt,.pptx',
  BROCHURE: '.pdf',
  DOCUMENT: '.pdf,.doc,.docx',
  COMPANY_LOGO: '.jpg,.jpeg,.png,.webp',
  GALLERY: '.jpg,.jpeg,.png,.webp',
  IMAGE: '.jpg,.jpeg,.png,.webp',
  VIDEO: '.mp4,.mpeg,.mov,.webm',
  YOUTUBE_VIDEO: '', // No file input needed
  WEBSITE: '', // No file input needed
};
