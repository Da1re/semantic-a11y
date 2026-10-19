import { useWatch } from 'react-hook-form';
import type { AuditFormValues } from '../models/audit-form';
import { toPastedPreview, toSamplePreview, type PreviewSource } from '../models/preview-source';
import { usePlaygroundStore } from '../store/use-playground-store';

export function usePreviewSource(): PreviewSource | null {
  const source = useWatch<AuditFormValues, 'source'>({ name: 'source' });
  const sampleId = useWatch<AuditFormValues, 'sampleId'>({ name: 'sampleId' });
  const auditTarget = usePlaygroundStore((state) => state.auditTarget);
  const isFixedView = usePlaygroundStore((state) => state.view === 'fixed');
  if (source === 'html') return toPastedPreview(auditTarget);
  return toSamplePreview(sampleId, isFixedView);
}
