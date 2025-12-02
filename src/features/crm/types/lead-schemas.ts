import { z } from "zod";
import {
  Department,
  LeadPriority,
  LeadSource,
  LeadStatus,
  TeamMember,
} from "@/generated/prisma";

// Enum for sort fields
export const LeadSortField = z.enum([
  "lastContactDate",
  "createdAt",
  "name",
  "minTicketSize",
  "maxTicketSize",
]);

export type LeadSortFieldType = z.infer<typeof LeadSortField>;

// Enum for sort direction
export const SortDirection = z.enum(["asc", "desc"]);

export type SortDirectionType = z.infer<typeof SortDirection>;

// Lead list input schema
export const leadListInputSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  
  // Filters
  leadSource: z.nativeEnum(LeadSource).optional(),
  assignedTo: z.string().optional(), // User ID
  department: z.nativeEnum(Department).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  lastContactDateFrom: z.coerce.date().optional(),
  lastContactDateTo: z.coerce.date().optional(),
  
  // Sorting
  sortBy: LeadSortField.default("lastContactDate"),
  sortDirection: SortDirection.default("desc"),
});

export type LeadListInput = z.infer<typeof leadListInputSchema>;

// Assign lead schema
export const assignLeadSchema = z.object({
  leadId: z.string(),
  assignedToId: z.string(),
  department: z.nativeEnum(Department).optional(),
});

export type AssignLeadInput = z.infer<typeof assignLeadSchema>;

// Add note schema
export const addNoteSchema = z.object({
  leadId: z.string(),
  note: z.string().min(1, "Note cannot be empty"),
});

export type AddNoteInput = z.infer<typeof addNoteSchema>;

// Schedule follow-up schema
export const scheduleFollowUpSchema = z.object({
  leadId: z.string(),
  followUpDate: z.coerce.date(),
  note: z.string().optional(),
});

export type ScheduleFollowUpInput = z.infer<typeof scheduleFollowUpSchema>;

// Update lead status schema
export const updateLeadStatusSchema = z.object({
  leadId: z.string(),
  status: z.nativeEnum(LeadStatus),
  priority: z.nativeEnum(LeadPriority).optional(),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

// Lead response type
export interface LeadListItem {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  lastContactDate: Date | null;
  status: LeadStatus;
  priority: LeadPriority | null;
  leadSource: LeadSource | null;
  department: Department | null;
  minTicketSize: number | null;
  maxTicketSize: number | null;
  leadResponsible: {
    id: string;
    name: string;
  } | null;
  leadMainContact: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
}

export interface LeadListResponse {
  items: LeadListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
