export const DEFAULT_LANGUAGE = "es";

export const SUPPORTED_LANGUAGES = ["en", "es", "pt"];

export const LANGUAGE_LOCALES = {
  en: "en-US",
  es: "es-AR",
  pt: "pt-BR",
};

export const translations = {
  en: {
    "language.label": "Language",
    "language.option.en": "English",
    "language.option.es": "Espanol",
    "language.option.pt": "Portugues",

    "header.logoAlt": "Project logo",
    "header.questionsThisMonth": "Questions this month",
    "header.usageResetDate": "Your monthly limit will reset on {date}.",
    "header.usageResetUnavailable":
      "The monthly reset date is not available yet.",
    "header.menu": "Menu",
    "header.limits": "Limits",
    "header.limitsUsed": "Generated this month",
    "header.limitsCap": "Monthly limit",
    "header.limitsReset": "Resets on",
    "header.limitsUnavailableValue": "Not available",
    "header.language": "Language",
    "header.home": "Home",
    "header.myAnswers": "My answers",
    "header.feedback": "Feedback",
    "header.logOut": "Log out",

    "footer.developedBy": "Developed by Pedro Vieira",

    "landing.highlight.multipleChoice.title":
      "AI-generated multiple-choice questions",
    "landing.highlight.multipleChoice.description":
      "Get anatomy practice questions designed for fast review and repeated training.",
    "landing.highlight.essays.title":
      "AI-generated and AI-reviewed essays (Coming soon)",
    "landing.highlight.essays.description":
      "Receive prompts, submit your response, and get feedback with improvement points and possible content corrections.",
    "landing.highlight.mockExams.title": "Mock exams (Coming soon)",
    "landing.highlight.mockExams.description":
      "Answer questions in sequence to simulate real exam behavior.",
    "landing.feature.questionLimit": "Up to 150 question generations per month",
    "landing.subject.anatomy": "Anatomy",
    "landing.subject.histology": "Histology (Coming soon)",
    "landing.subject.embryology": "Embryology (Coming soon)",
    "landing.subject.molecularBiology": "Molecular biology (Coming soon)",
    "landing.subject.genetics": "Genetics (Coming soon)",
    "landing.title": "UBA Trainer",
    "landing.subtitle": "A platform to train for your UBA anatomy exams.",
    "landing.planTitle": "Basic Plan",
    "landing.subjectsTitle": "Subjects available in the app",
    "landing.createAccount": "Create account and subscribe",
    "landing.alreadyHaveAccount": "I already have an account",

    "login.invalidServerResponse": "Invalid response from the server.",
    "login.failed": "Login failed. Check your credentials and try again.",
    "login.title": "Login",
    "login.nickname": "Nickname",
    "login.password": "Password",
    "login.hidePassword": "Hide password",
    "login.showPassword": "Show password",
    "login.signingIn": "Signing in...",
    "login.signIn": "Sign in",
    "login.forgotPassword": "Forgot password?",
    "login.createAccount": "Create account",
    "password.requirements":
      "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",

    "forgotPassword.title": "Forgot your password?",
    "forgotPassword.description":
      "Enter the email linked to your account and we will send you a password reset link.",
    "forgotPassword.email": "Email",
    "forgotPassword.submit": "Send reset link",
    "forgotPassword.submitting": "Sending...",
    "forgotPassword.success":
      "If the email exists, password reset instructions have been generated.",
    "forgotPassword.failed":
      "Unable to start password recovery right now.",
    "forgotPassword.backToLogin": "Back to login",

    "resetPassword.title": "Reset password",
    "resetPassword.description":
      "Choose a new password to finish recovering your account.",
    "resetPassword.newPassword": "New password",
    "resetPassword.confirmPassword": "Confirm new password",
    "resetPassword.submit": "Update password",
    "resetPassword.submitting": "Updating...",
    "resetPassword.success": "Password updated successfully.",
    "resetPassword.failed": "Unable to update your password right now.",
    "resetPassword.invalidToken":
      "The password reset link is invalid or has already been used.",
    "resetPassword.passwordMismatch": "The passwords do not match.",
    "resetPassword.backToLogin": "Back to login",

    "register.userNotIdentified": "Unable to identify the created user.",
    "register.successRedirect":
      "Account created successfully. Redirecting to checkout...",
    "register.checkoutStartFailed":
      "Unable to start the subscription checkout.",
    "register.failed": "Unable to complete registration.",
    "register.title": "Register",
    "register.name": "Name",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.password": "Password",
    "register.hidePassword": "Hide password",
    "register.showPassword": "Show password",
    "register.redirecting": "Redirecting...",
    "register.submit": "Register and subscribe",
    "register.backToLogin": "Back to login",

    "subjectSelection.userNotIdentified":
      "Unable to identify the authenticated user.",
    "subjectSelection.checkoutStartFailed":
      "Unable to start the subscription checkout.",
    "subjectSelection.paymentPending":
      "Payment is still processing or the subscription has not been released yet.",
    "subjectSelection.subscriptionStatusFailed":
      "Unable to verify the subscription status.",
    "subjectSelection.pendingBadge": "Pending subscription",
    "subjectSelection.pendingTitle": "Activate your access to use the platform",
    "subjectSelection.pendingDescription":
      "Your login is already active. To use the protected routes in the app, finish the Stripe subscription and then refresh your access status.",
    "subjectSelection.planLabel": "UBA Basic Plan",
    "subjectSelection.step1Title": "1. Complete payment",
    "subjectSelection.step1Description":
      "Generate the checkout session and complete the subscription with Stripe.",
    "subjectSelection.openingCheckout": "Opening checkout...",
    "subjectSelection.subscribeNow": "Subscribe now",
    "subjectSelection.step2Title": "2. Unlock access",
    "subjectSelection.step2Description":
      "After payment, check whether the API has already received the Stripe events.",
    "subjectSelection.checking": "Checking...",
    "subjectSelection.alreadyPaid": "I already paid, check access",
    "subjectSelection.connectedUser": "Connected user:",
    "subjectSelection.activeAccount": "Active account",
    "subjectSelection.chooseSubject": "Choose your subject",
    "subjectSelection.viewMyAnswers": "View my answers",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Splanchnology",
    "anatomy.topic.neuroanatomy": "Neuroanatomy",
    "anatomy.generateFailed": "Unable to generate a new question right now.",
    "anatomy.chooseTopic": "Choose your anatomy topic",
    "anatomy.selectedTopic": "Selected topic:",
    "anatomy.changeTopic": "Change topic",
    "anatomy.nextQuestion": "Next question",

    "question.userNotIdentified": "Unable to identify the authenticated user.",
    "question.saveFailed": "Unable to save your answer. Please try again.",
    "question.savingAnswer": "Saving your answer...",
    "question.correct": "Correct:",
    "question.yourAnswer": "Your answer:",

    "answeredQuestions.userNotIdentified":
      "Unable to identify the authenticated user.",
    "answeredQuestions.loadFailed": "Unable to load your answers right now.",
    "answeredQuestions.badge": "User history",
    "answeredQuestions.title": "Answered questions",
    "answeredQuestions.subtitle":
      "See the latest saved answer for each question you have answered.",
    "answeredQuestions.countLabel": "questions recorded",
    "answeredQuestions.emptyTitle": "No answers found",
    "answeredQuestions.emptySubtitle":
      "As soon as you answer a question, it will appear here.",
    "answeredQuestions.table.question": "Question",
    "answeredQuestions.table.subject": "Subject",
    "answeredQuestions.table.yourAnswer": "Your answer",
    "answeredQuestions.table.correctAnswer": "Correct answer",
    "answeredQuestions.table.answeredAt": "Answered at",

    "feedback.userNotIdentified":
      "Unable to identify the authenticated user.",
    "feedback.title": "Send feedback",
    "feedback.description":
      "Share suggestions, ideas, or issues you noticed while using the platform.",
    "feedback.label": "Your feedback",
    "feedback.placeholder":
      "Tell us what would make the platform better for you.",
    "feedback.submit": "Send feedback",
    "feedback.submitting": "Sending...",
    "feedback.success": "Thanks! Your feedback has been sent.",
    "feedback.failed": "Unable to send your feedback right now.",
    "feedback.backToHome": "Back to home",
  },
  es: {
    "language.label": "Idioma",
    "language.option.en": "English",
    "language.option.es": "Español",
    "language.option.pt": "Portugués",

    "header.logoAlt": "Logo del proyecto",
    "header.questionsThisMonth": "Preguntas este mes",
    "header.usageResetDate": "Tu límite mensual se reiniciará el {date}.",
    "header.usageResetUnavailable":
      "La fecha de renovación del límite mensual todavía no está disponible.",
    "header.menu": "Menu",
    "header.limits": "Limites",
    "header.limitsUsed": "Generadas este mes",
    "header.limitsCap": "Limite mensual",
    "header.limitsReset": "Se reinicia el",
    "header.limitsUnavailableValue": "No disponible",
    "header.language": "Idioma",
    "header.home": "Inicio",
    "header.myAnswers": "Mis respuestas",
    "header.feedback": "Feedback",
    "header.logOut": "Cerrar sesión",

    "footer.developedBy": "Desarrollado por Pedro Vieira",

    "landing.highlight.multipleChoice.title":
      "Preguntas de opción múltiple generadas por IA",
    "landing.highlight.multipleChoice.description":
      "Recibí preguntas de anatomía pensadas para repasos rápidos y entrenamiento recurrente.",
    "landing.highlight.essays.title":
      "Preguntas a desarrollar generadas y evaluadas por IA (Próximamente)",
    "landing.highlight.essays.description":
      "Recibí consignas, enviá tu respuesta y obtené retroalimentación con puntos de mejora y posibles correcciones de contenido.",
    "landing.highlight.mockExams.title": "Simulacros de examen (Próximamente)",
    "landing.highlight.mockExams.description":
      "Responde preguntas en secuencia para simular el comportamiento de un examen real.",
    "landing.feature.questionLimit":
      "Hasta 150 generaciones de preguntas por mes",
    "landing.subject.anatomy": "Anatomía",
    "landing.subject.histology": "Histología (Próximamente)",
    "landing.subject.embryology": "Embriología (Próximamente)",
    "landing.subject.molecularBiology": "Biología molecular (Próximamente)",
    "landing.subject.genetics": "Genética (Próximamente)",
    "landing.title": "UBA Trainer",
    "landing.subtitle":
      "Una plataforma para entrenarte para tus exámenes de anatomía de la UBA.",
    "landing.planTitle": "Plan Básico",
    "landing.subjectsTitle": "Materias disponibles en la aplicación",
    "landing.createAccount": "Crear cuenta y suscribirme",
    "landing.alreadyHaveAccount": "Ya tengo cuenta",

    "login.invalidServerResponse": "Respuesta inválida del servidor.",
    "login.failed":
      "El inicio de sesión falló. Revisá tus credenciales y volvé a intentarlo.",
    "login.title": "Iniciar sesión",
    "login.nickname": "Nickname",
    "login.password": "Contraseña",
    "login.hidePassword": "Ocultar contraseña",
    "login.showPassword": "Mostrar contraseña",
    "login.signingIn": "Ingresando...",
    "login.signIn": "Entrar",
    "login.forgotPassword": "Olvide mi contrasena",
    "login.createAccount": "Crear cuenta",
    "password.requirements":
      "La contrasena debe tener al menos 8 caracteres e incluir una letra mayuscula, una minuscula, un numero y un caracter especial.",

    "forgotPassword.title": "Olvidaste tu contrasena?",
    "forgotPassword.description":
      "Ingresa el email vinculado a tu cuenta y te enviaremos un enlace para restablecer tu contrasena.",
    "forgotPassword.email": "Email",
    "forgotPassword.submit": "Enviar enlace de recuperacion",
    "forgotPassword.submitting": "Enviando...",
    "forgotPassword.success":
      "Si el email existe, ya se generaron las instrucciones para restablecer la contrasena.",
    "forgotPassword.failed":
      "No fue posible iniciar la recuperacion de contrasena en este momento.",
    "forgotPassword.backToLogin": "Volver al login",

    "resetPassword.title": "Restablecer contrasena",
    "resetPassword.description":
      "Elige una nueva contrasena para terminar de recuperar tu cuenta.",
    "resetPassword.newPassword": "Nueva contrasena",
    "resetPassword.confirmPassword": "Confirmar nueva contrasena",
    "resetPassword.submit": "Actualizar contrasena",
    "resetPassword.submitting": "Actualizando...",
    "resetPassword.success": "Contrasena actualizada con exito.",
    "resetPassword.failed":
      "No fue posible actualizar tu contrasena en este momento.",
    "resetPassword.invalidToken":
      "El enlace para restablecer la contrasena es invalido o ya fue usado.",
    "resetPassword.passwordMismatch": "Las contrasenas no coinciden.",
    "resetPassword.backToLogin": "Volver al login",

    "register.userNotIdentified":
      "No fue posible identificar al usuario creado.",
    "register.successRedirect":
      "Cuenta creada con éxito. Redirigiendo al checkout...",
    "register.checkoutStartFailed":
      "No fue posible iniciar el checkout de la suscripción.",
    "register.failed": "No fue posible completar el registro.",
    "register.title": "Registro",
    "register.name": "Nombre",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.password": "Contraseña",
    "register.hidePassword": "Ocultar contraseña",
    "register.showPassword": "Mostrar contraseña",
    "register.redirecting": "Redirigiendo...",
    "register.submit": "Registrarme y suscribirme",
    "register.backToLogin": "Volver al login",

    "subjectSelection.userNotIdentified":
      "No fue posible identificar al usuario autenticado.",
    "subjectSelection.checkoutStartFailed":
      "No fue posible iniciar el checkout de la suscripción.",
    "subjectSelection.paymentPending":
      "El pago todavía está en procesamiento o la suscripción aún no fue habilitada.",
    "subjectSelection.subscriptionStatusFailed":
      "No fue posible verificar el estado de la suscripción.",
    "subjectSelection.pendingBadge": "Suscripción pendiente",
    "subjectSelection.pendingTitle": "Activa tu acceso para usar la plataforma",
    "subjectSelection.pendingDescription":
      "Tu login ya está activo. Para usar las rutas protegidas de la aplicación, completá la suscripción en Stripe y después actualizá el estado del acceso.",
    "subjectSelection.planLabel": "Plan Básico UBA",
    "subjectSelection.step1Title": "1. Completar pago",
    "subjectSelection.step1Description":
      "Generá la sesión de checkout y completá la suscripción con Stripe.",
    "subjectSelection.openingCheckout": "Abriendo checkout...",
    "subjectSelection.subscribeNow": "Suscribirme ahora",
    "subjectSelection.step2Title": "2. Liberar acceso",
    "subjectSelection.step2Description":
      "Después del pago, verificá si la API ya recibió los eventos de Stripe.",
    "subjectSelection.checking": "Verificando...",
    "subjectSelection.alreadyPaid": "Ya pagué, verificar acceso",
    "subjectSelection.connectedUser": "Usuario conectado:",
    "subjectSelection.activeAccount": "Cuenta activa",
    "subjectSelection.chooseSubject": "Elige tu materia",
    "subjectSelection.viewMyAnswers": "Ver mis respuestas",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Esplacnología",
    "anatomy.topic.neuroanatomy": "Neuroanatomía",
    "anatomy.generateFailed":
      "No fue posible generar una nueva pregunta en este momento.",
    "anatomy.chooseTopic": "Elegí tu tema de anatomía",
    "anatomy.selectedTopic": "Tema seleccionado:",
    "anatomy.changeTopic": "Cambiar tema",
    "anatomy.nextQuestion": "Siguiente pregunta",

    "question.userNotIdentified":
      "No fue posible identificar al usuario autenticado.",
    "question.saveFailed":
      "No fue posible guardar tu respuesta. Volvé a intentarlo.",
    "question.savingAnswer": "Guardando tu respuesta...",
    "question.correct": "Correcta:",
    "question.yourAnswer": "Tu respuesta:",

    "answeredQuestions.userNotIdentified":
      "No fue posible identificar al usuario autenticado.",
    "answeredQuestions.loadFailed":
      "No fue posible cargar tus respuestas en este momento.",
    "answeredQuestions.badge": "Historial del usuario",
    "answeredQuestions.title": "Preguntas respondidas",
    "answeredQuestions.subtitle":
      "Mirá la última respuesta guardada para cada pregunta que ya respondiste.",
    "answeredQuestions.countLabel": "preguntas registradas",
    "answeredQuestions.emptyTitle": "No se encontraron respuestas",
    "answeredQuestions.emptySubtitle":
      "En cuanto respondas una pregunta, aparecerá acá.",
    "answeredQuestions.table.question": "Pregunta",
    "answeredQuestions.table.subject": "Materia",
    "answeredQuestions.table.yourAnswer": "Tu respuesta",
    "answeredQuestions.table.correctAnswer": "Respuesta correcta",
    "answeredQuestions.table.answeredAt": "Respondida el",

    "feedback.userNotIdentified":
      "No fue posible identificar al usuario autenticado.",
    "feedback.title": "Enviar feedback",
    "feedback.description":
      "Comparte sugerencias, ideas o problemas que notaste mientras usabas la plataforma.",
    "feedback.label": "Tu feedback",
    "feedback.placeholder":
      "Cuentanos que mejoraria tu experiencia en la plataforma.",
    "feedback.submit": "Enviar feedback",
    "feedback.submitting": "Enviando...",
    "feedback.success": "Gracias! Tu feedback fue enviado.",
    "feedback.failed": "No fue posible enviar tu feedback en este momento.",
    "feedback.backToHome": "Volver al inicio",
  },
  pt: {
    "language.label": "Idioma",
    "language.option.en": "English",
    "language.option.es": "Espanol",
    "language.option.pt": "Portugues",

    "header.logoAlt": "Logo do projeto",
    "header.questionsThisMonth": "Questoes no mes",
    "header.usageResetDate": "Seu limite mensal sera renovado em {date}.",
    "header.usageResetUnavailable":
      "A data de renovacao do limite mensal ainda nao esta disponivel.",
    "header.menu": "Menu",
    "header.limits": "Limites",
    "header.limitsUsed": "Geradas no mes",
    "header.limitsCap": "Limite mensal",
    "header.limitsReset": "Renova em",
    "header.limitsUnavailableValue": "Nao disponivel",
    "header.language": "Idioma",
    "header.home": "Inicio",
    "header.myAnswers": "Minhas respostas",
    "header.feedback": "Feedback",
    "header.logOut": "Sair",

    "footer.developedBy": "Desenvolvido por Pedro Vieira",

    "landing.highlight.multipleChoice.title":
      "Questoes de multipla escolha geradas por IA",
    "landing.highlight.multipleChoice.description":
      "Receba perguntas de anatomia pensadas para revisao rapida e treino recorrente.",
    "landing.highlight.essays.title":
      "Questoes discursivas geradas e avaliadas por IA (Em breve)",
    "landing.highlight.essays.description":
      "Receba enunciados, envie sua resposta e receba feedback com pontos de melhoria e possiveis correcoes de conteudo.",
    "landing.highlight.mockExams.title": "Simulados (Em breve)",
    "landing.highlight.mockExams.description":
      "Responda perguntas em sequencia para simular o comportamento de provas reais.",
    "landing.feature.questionLimit": "Ate 150 geracoes de perguntas por mes",
    "landing.subject.anatomy": "Anatomia",
    "landing.subject.histology": "Histologia (Em breve)",
    "landing.subject.embryology": "Embriologia (Em breve)",
    "landing.subject.molecularBiology": "Biologia molecular (Em breve)",
    "landing.subject.genetics": "Genetica (Em breve)",
    "landing.title": "UBA Trainer",
    "landing.subtitle":
      "Uma plataforma para treinar para as suas provas de anatomia da UBA.",
    "landing.planTitle": "Plano Basico",
    "landing.subjectsTitle": "Materias disponiveis no aplicativo",
    "landing.createAccount": "Criar conta e assinar",
    "landing.alreadyHaveAccount": "Ja tenho conta",

    "login.invalidServerResponse": "Resposta invalida do servidor.",
    "login.failed":
      "O login falhou. Verifique suas credenciais e tente novamente.",
    "login.title": "Login",
    "login.nickname": "Nickname",
    "login.password": "Senha",
    "login.hidePassword": "Ocultar senha",
    "login.showPassword": "Mostrar senha",
    "login.signingIn": "Entrando...",
    "login.signIn": "Entrar",
    "login.forgotPassword": "Esqueci minha senha",
    "login.createAccount": "Criar conta",
    "password.requirements":
      "A senha deve ter pelo menos 8 caracteres e incluir uma letra maiuscula, uma minuscula, um numero e um caractere especial.",

    "forgotPassword.title": "Esqueceu sua senha?",
    "forgotPassword.description":
      "Informe o email vinculado a sua conta e enviaremos um link para redefinir sua senha.",
    "forgotPassword.email": "Email",
    "forgotPassword.submit": "Enviar link de redefinicao",
    "forgotPassword.submitting": "Enviando...",
    "forgotPassword.success":
      "Se o email existir, as instrucoes de redefinicao de senha foram geradas.",
    "forgotPassword.failed":
      "Nao foi possivel iniciar a recuperacao de senha no momento.",
    "forgotPassword.backToLogin": "Voltar para o login",

    "resetPassword.title": "Redefinir senha",
    "resetPassword.description":
      "Escolha uma nova senha para concluir a recuperacao da sua conta.",
    "resetPassword.newPassword": "Nova senha",
    "resetPassword.confirmPassword": "Confirmar nova senha",
    "resetPassword.submit": "Atualizar senha",
    "resetPassword.submitting": "Atualizando...",
    "resetPassword.success": "Senha atualizada com sucesso.",
    "resetPassword.failed":
      "Nao foi possivel atualizar sua senha no momento.",
    "resetPassword.invalidToken":
      "O link de redefinicao de senha e invalido ou ja foi usado.",
    "resetPassword.passwordMismatch": "As senhas nao coincidem.",
    "resetPassword.backToLogin": "Voltar para o login",

    "register.userNotIdentified":
      "Nao foi possivel identificar o usuario criado.",
    "register.successRedirect":
      "Cadastro realizado com sucesso. Redirecionando para o checkout...",
    "register.checkoutStartFailed":
      "Nao foi possivel iniciar o checkout da assinatura.",
    "register.failed": "Nao foi possivel concluir o cadastro.",
    "register.title": "Cadastro",
    "register.name": "Nome",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.password": "Senha",
    "register.hidePassword": "Ocultar senha",
    "register.showPassword": "Mostrar senha",
    "register.redirecting": "Redirecionando...",
    "register.submit": "Cadastrar e assinar",
    "register.backToLogin": "Voltar para o login",

    "subjectSelection.userNotIdentified":
      "Nao foi possivel identificar o usuario autenticado.",
    "subjectSelection.checkoutStartFailed":
      "Nao foi possivel iniciar o checkout da assinatura.",
    "subjectSelection.paymentPending":
      "O pagamento ainda esta em processamento ou a assinatura ainda nao foi liberada.",
    "subjectSelection.subscriptionStatusFailed":
      "Nao foi possivel verificar o status da assinatura.",
    "subjectSelection.pendingBadge": "Assinatura pendente",
    "subjectSelection.pendingTitle": "Ative seu acesso para usar a plataforma",
    "subjectSelection.pendingDescription":
      "Seu login ja esta liberado. Para usar as rotas protegidas do aplicativo, finalize a assinatura no Stripe e depois atualize o status do acesso.",
    "subjectSelection.planLabel": "Plano Basico UBA",
    "subjectSelection.step1Title": "1. Concluir pagamento",
    "subjectSelection.step1Description":
      "Gere a sessao de checkout e finalize a assinatura com o Stripe.",
    "subjectSelection.openingCheckout": "Abrindo checkout...",
    "subjectSelection.subscribeNow": "Assinar agora",
    "subjectSelection.step2Title": "2. Liberar acesso",
    "subjectSelection.step2Description":
      "Depois do pagamento, verifique se a API ja recebeu os eventos do Stripe.",
    "subjectSelection.checking": "Verificando...",
    "subjectSelection.alreadyPaid": "Ja paguei, verificar acesso",
    "subjectSelection.connectedUser": "Usuario conectado:",
    "subjectSelection.activeAccount": "Conta ativa",
    "subjectSelection.chooseSubject": "Escolha sua materia",
    "subjectSelection.viewMyAnswers": "Ver minhas respostas",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Esplacnologia",
    "anatomy.topic.neuroanatomy": "Neuroanatomia",
    "anatomy.generateFailed":
      "Nao foi possivel gerar uma nova pergunta no momento.",
    "anatomy.chooseTopic": "Escolha seu tema de anatomia",
    "anatomy.selectedTopic": "Tema selecionado:",
    "anatomy.changeTopic": "Trocar tema",
    "anatomy.nextQuestion": "Proxima pergunta",

    "question.userNotIdentified":
      "Nao foi possivel identificar o usuario autenticado.",
    "question.saveFailed":
      "Nao foi possivel salvar sua resposta. Tente novamente.",
    "question.savingAnswer": "Salvando sua resposta...",
    "question.correct": "Correta:",
    "question.yourAnswer": "Sua resposta:",

    "answeredQuestions.userNotIdentified":
      "Nao foi possivel identificar o usuario autenticado.",
    "answeredQuestions.loadFailed":
      "Nao foi possivel carregar suas respostas no momento.",
    "answeredQuestions.badge": "Historico do usuario",
    "answeredQuestions.title": "Questoes respondidas",
    "answeredQuestions.subtitle":
      "Veja a ultima resposta salva em cada questao que voce ja respondeu.",
    "answeredQuestions.countLabel": "questoes registradas",
    "answeredQuestions.emptyTitle": "Nenhuma resposta encontrada",
    "answeredQuestions.emptySubtitle":
      "Assim que voce responder uma pergunta, ela vai aparecer aqui.",
    "answeredQuestions.table.question": "Questao",
    "answeredQuestions.table.subject": "Materia",
    "answeredQuestions.table.yourAnswer": "Sua resposta",
    "answeredQuestions.table.correctAnswer": "Resposta correta",
    "answeredQuestions.table.answeredAt": "Respondida em",

    "feedback.userNotIdentified":
      "Nao foi possivel identificar o usuario autenticado.",
    "feedback.title": "Enviar feedback",
    "feedback.description":
      "Compartilhe sugestoes, ideias ou problemas que voce percebeu ao usar a plataforma.",
    "feedback.label": "Seu feedback",
    "feedback.placeholder":
      "Conte o que deixaria a plataforma melhor para voce.",
    "feedback.submit": "Enviar feedback",
    "feedback.submitting": "Enviando...",
    "feedback.success": "Obrigado! Seu feedback foi enviado.",
    "feedback.failed": "Nao foi possivel enviar seu feedback no momento.",
    "feedback.backToHome": "Voltar para o inicio",
  },
};
