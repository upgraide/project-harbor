export default {
  title: "Solicitar acesso",
  description: "Por favor, insira suas informações para solicitar acesso.",
  emailPlaceholder: "m@example.com",
  submit: "Solicitar acesso",
  haveAccount: "Já tem uma conta?",
  login: "Entrar",

  schemaMessages: {
    email: "Por favor, insira um email válido",
    name: {
      required: "O nome é obrigatório",
      max: "O nome deve ter menos de 100 caracteres",
    },
    company: {
      required: "A empresa é obrigatória",
      max: "A empresa deve ter menos de 100 caracteres",
    },
    phone: "Por favor, insira um número de telefone válido",
    position: {
      required: "O cargo é obrigatório",
      max: "O cargo deve ter menos de 100 caracteres",
    },
    message: {
      required: "A mensagem deve ter pelo menos 10 caracteres",
      max: "A mensagem deve ter menos de 1000 caracteres",
    },
  },

  labels: {
    name: "Nome",
    email: "Email",
    company: "Empresa",
    phone: "Telefone",
    position: "Cargo",
    message: "Mensagem",
  },

  placeholders: {
    name: "O seu nome",
    email: "m@exemplo.com",
    company: "A sua empresa",
    phone: "+351 912 345 678",
    position: "O seu cargo",
    message: "A sua mensagem",
  },
} as const;
