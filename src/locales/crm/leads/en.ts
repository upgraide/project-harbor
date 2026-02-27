export default {
  title: "Lead Management",
  description: "Manage and track all potential investors and clients",
  searchPlaceholder: "Search by name, email, or company...",
  errorMessage: "Failed to load leads. Please try again.",
  emptyMessage: "No leads found.",

  filters: {
    title: "Filters",
    leadSource: "Lead Source",
    assignedTo: "Assigned To",
    department: "Department",
    lastContactDate: "Last Contact Date",
    status: "Status",
    priority: "Priority",
    all: "All",
    reset: "Reset Filters",
    apply: "Apply Filters",
  },

  sorting: {
    title: "Sort By",
    lastContactDate: "Last Contact Date",
    createdAt: "Creation Date",
    name: "Name",
    minTicketSize: "Ticket Size (Min)",
    maxTicketSize: "Ticket Size (Max)",
  },

  leadSource: {
    WEBSITE: "Website",
    REFERRAL: "Referral",
    COLD_OUTREACH: "Cold Outreach",
    NETWORKING_EVENT: "Networking Event",
    LINKEDIN: "LinkedIn",
    EMAIL_CAMPAIGN: "Email Campaign",
    PARTNER: "Partner",
    EXISTING_CLIENT: "Existing Client",
    ACCESS_REQUEST: "Access Request",
    OTHER: "Other",
  },

  leadStatus: {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    MEETING_SCHEDULED: "Meeting Scheduled",
    PROPOSAL_SENT: "Proposal Sent",
    NEGOTIATION: "Negotiation",
    CONVERTED: "Converted",
    LOST: "Lost",
    ON_HOLD: "On Hold",
    NURTURE: "Nurture",
  },

  leadPriority: {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  },

  department: {
    MNA: "M&A",
    CRE: "CRE",
    MNA_AND_CRE: "M&A & CRE",
  },

  table: {
    name: "Name",
    company: "Company",
    email: "Email",
    lastContactDate: "Last Contact",
    status: "Status",
    priority: "Priority",
    leadSource: "Source",
    assignedTo: "Assigned To",
    department: "Department",
    ticketSize: "Ticket Size",
    actions: "Actions",
    noData: "No leads available",
  },

  quickActions: {
    title: "Quick Actions",
    assign: "Assign Lead",
    addNote: "Add Note",
    scheduleFollowUp: "Schedule Follow-up",
    viewDetails: "View Details",
  },

  assignDialog: {
    title: "Assign Lead",
    description: "Assign this lead to a team member",
    labels: {
      assignTo: "Assign To",
      department: "Department",
    },
    placeholders: {
      selectUser: "Select a team member",
      selectDepartment: "Select department",
    },
    assign: "Assign",
    assigning: "Assigning...",
    cancel: "Cancel",
    success: "Lead assigned successfully",
    error: "Failed to assign lead",
  },

  noteDialog: {
    title: "Add Note",
    description: "Add a note to this lead",
    labels: {
      note: "Note",
    },
    placeholders: {
      note: "Enter your note here...",
    },
    add: "Add Note",
    adding: "Adding...",
    cancel: "Cancel",
    success: "Note added successfully",
    error: "Failed to add note",
  },

  followUpDialog: {
    title: "Schedule Follow-up",
    description: "Schedule a follow-up for this lead",
    labels: {
      date: "Follow-up Date",
      time: "Time",
      note: "Note (optional)",
    },
    placeholders: {
      date: "Select date",
      time: "Select time",
      note: "Add a note about the follow-up...",
    },
    schedule: "Schedule",
    scheduling: "Scheduling...",
    cancel: "Cancel",
    success: "Follow-up scheduled successfully",
    error: "Failed to schedule follow-up",
  },

  lastFollowUps: {
    title: "Last Follow-ups",
    description: "Record of client/investor interactions and conversations",
    addButton: "Add Follow-up",
    editButton: "Edit",
    deleteButton: "Delete",
    empty: "No follow-ups recorded yet",
    followUpDate: "Follow-up Date",
    description_label: "Description",
    contactedBy: "Contacted By",
    personContacted: "Person Contacted",
    createdAt: "Recorded On",
    addDialog: {
      title: "Add Follow-up",
      description: "Record details about this client/investor interaction",
      save: "Save Follow-up",
      saving: "Saving...",
      cancel: "Cancel",
    },
    editDialog: {
      title: "Edit Follow-up",
      description: "Update follow-up details",
      save: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
    },
    deleteDialog: {
      title: "Delete Follow-up",
      description:
        "Are you sure you want to delete this follow-up? This action cannot be undone.",
      confirm: "Delete",
      cancel: "Cancel",
    },
    labels: {
      followUpDate: "Follow-up Date",
      description: "Description",
      contactedBy: "Team Member (Contacted By)",
      personContacted: "Client/Investor (Person Contacted)",
      selectDate: "Select date",
      selectPerson: "Select person",
      descriptionPlaceholder:
        "Describe what was discussed during this interaction...",
    },
    validation: {
      dateRequired: "Follow-up date is required",
      descriptionRequired: "Description is required",
      contactedByRequired: "Please select who contacted",
      personContactedRequired: "Please select who was contacted",
    },
  },

  toast: {
    success: "Operation completed successfully",
    error: "An error occurred. Please try again.",
  },
};
