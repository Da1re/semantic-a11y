import type { InputSource } from '../constants/input-source';
import type { SampleId } from '../constants/sample';

export interface AuditFormValues {
  source: InputSource;
  sampleId: SampleId;
  html: string;
}
