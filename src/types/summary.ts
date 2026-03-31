import type {Party} from './party.ts';
import type {ImportantDate} from "./important-date.ts";

export interface Summary{
  id: string;
  document_id: string;
  is_ready: boolean;
  summary: string;
  parties: Party[];
  important_dates: ImportantDate[];
  created_at: string;
}
