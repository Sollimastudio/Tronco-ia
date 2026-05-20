export type VaultStatus = 'draft' | 'review' | 'approved' | 'final' | 'rejected';

export type VaultItemType =
  | 'title'
  | 'subtitle'
  | 'promise'
  | 'outline'
  | 'chapter'
  | 'block'
  | 'visual_direction'
  | 'diagram'
  | 'image'
  | 'html'
  | 'pdf'
  | 'docx'
  | 'zip'
  | 'other';

export interface ApprovedVaultItem {
  id: string;
  projectId: string;
  type: VaultItemType;
  title: string;
  content?: string;
  filePath?: string;
  status: VaultStatus;
  version: number;
  approvedAt?: string;
  notes?: string;
}

export interface ApprovedVault {
  projectId: string;
  items: ApprovedVaultItem[];
}

export function addToVault(vault: ApprovedVault, item: ApprovedVaultItem): ApprovedVault {
  return {
    ...vault,
    items: [...vault.items, item]
  };
}

export function markAsFinal(vault: ApprovedVault, itemId: string): ApprovedVault {
  return {
    ...vault,
    items: vault.items.map((item) =>
      item.id === itemId
        ? { ...item, status: 'final', approvedAt: new Date().toISOString() }
        : item
    )
  };
}

export function getFinalItems(vault: ApprovedVault) {
  return vault.items.filter((item) => item.status === 'approved' || item.status === 'final');
}
