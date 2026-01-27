export default {
  title: "Lead Details",
  loading: "Loading...",
  notFound: "Lead not found",
  backToList: "Back to Leads",
  
  sections: {
    basicInfo: {
      title: "Basic Information",
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      website: "Website",
      status: "Status",
      priority: "Priority",
      source: "Source",
      department: "Department",
      leadScore: "Lead Score",
      createdAt: "Created At",
      tags: "Tags",
    },
    
    assignment: {
      title: "Assignment",
      responsible: "Responsible",
      mainContact: "Main Contact",
      unassigned: "Unassigned",
    },
    
    financial: {
      title: "Financial Information",
      ticketSize: "Ticket Size",
      targetReturn: "Target Return (IRR)",
      commissionRate: "Commission Rate",
      commissionNotes: "Commission Notes",
    },
    
    strategy: {
      title: "Investment Strategy",
      type: "Investor Type",
      strategy: "Strategy",
      segment: "Segment",
      locations: "Preferred Locations",
    },
    
    timeline: {
      title: "Timeline",
      lastContact: "Last Contact",
      nextFollowUp: "Next Follow-up",
      converted: "Converted At",
      lost: "Lost At",
      lostReason: "Lost Reason",
      noDate: "Not scheduled",
    },
    
    notes: {
      title: "Notes",
      addNote: "Add Note",
      noNotes: "No notes yet",
      by: "by",
      lastNotes: "Last Notes",
    },

    followUps: {
      title: "Last Follow-ups",
      noFollowUps: "No follow-ups recorded yet",
      contactedBy: "Contacted By",
      personContacted: "Person Contacted",
      recordedOn: "Recorded On",
    },
    
    activities: {
      title: "Activity Timeline",
      noActivities: "No activities yet",
      types: {
        NOTE: "Note",
        ASSIGNMENT_CHANGE: "Assignment Change",
        STATUS_CHANGE: "Status Change",
        FOLLOW_UP_SCHEDULED: "Follow-up Scheduled",
        FOLLOW_UP_COMPLETED: "Follow-up Completed",
        MEETING: "Meeting",
        EMAIL: "Email",
        CALL: "Call",
        CONVERTED: "Converted",
        LOST: "Lost",
      },
    },
    
    contact: {
      title: "Contact Details",
      representative: "Representative Name",
      physicalAddress: "Physical Address",
      acceptMarketing: "Accepts Marketing",
      yes: "Yes",
      no: "No",
      otherFacts: "Other Facts",
    },
  },
  
  actions: {
    assign: "Assign Lead",
    addNote: "Add Note",
    scheduleFollowUp: "Schedule Follow-up",
    updateStatus: "Update Status",
    edit: "Edit Lead",
  },
} as const;
