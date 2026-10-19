import { skipToken, useQuery } from '@tanstack/react-query';
import type { SampleId } from '../../constants/sample';
import { fetchFixedSampleAudit } from './audit-query';

export function useFixedAuditQuery(sampleId: SampleId | null) {
  return useQuery({
    queryKey: ['audit', 'sample', sampleId, 'fixed'],
    queryFn: sampleId === null ? skipToken : () => fetchFixedSampleAudit(sampleId),
    staleTime: Infinity,
    retry: false,
  });
}
