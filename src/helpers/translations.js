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
    "header.questionsThisMonth": "Questions in your package",
    "header.usageResetDate": "You still have {date} questions available.",
    "header.usageResetUnavailable":
      "The remaining question count is not available yet.",
    "header.menu": "Menu",
    "header.limits": "Limits",
    "header.limitsUsed": "Used from package",
    "header.limitsCap": "Package size",
    "header.limitsReset": "Remaining",
    "header.limitsUnavailableValue": "Not available",
    "header.language": "Language",
    "header.home": "Home",
    "header.profile": "Profile",
    "header.myAnswers": "My answers",
    "header.feedback": "Feedback",
    "header.logOut": "Log out",

    "footer.developedBy": "Developed by Pedro Vieira",
    "footer.contact": "Contact:",

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
    "landing.feature.questionLimit": "One package with 150 question generations and no expiration",
    "landing.subject.anatomy": "Anatomy",
    "landing.subject.histology": "Histology (Coming soon)",
    "landing.subject.embryology": "Embryology (Coming soon)",
    "landing.subject.biology": "Molecular biology and Genetics",
    "landing.title": "UBA Trainer",
    "landing.subtitle": "A platform to train for your UBA exams.",
    "landing.planTitle": "150-question package",
    "landing.planPrice": "Price: US$20",
    "landing.subjectsTitle": "Subjects available in the app",
    "landing.createAccount": "Create account and buy package",
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
      "Unable to start the package checkout.",
    "register.failed": "Unable to complete registration.",
    "register.title": "Register",
    "register.name": "Name",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.cbu": "CBU",
    "register.cbuPlaceholder": "0070010800000001234565",
    "register.cbuHelp": "Enter the 22-digit CBU linked to your bank account.",
    "register.password": "Password",
    "register.hidePassword": "Hide password",
    "register.showPassword": "Show password",
    "register.redirecting": "Redirecting...",
    "register.submit": "Register and buy package",
    "register.backToLogin": "Back to login",

    "subjectSelection.userNotIdentified":
      "Unable to identify the authenticated user.",
    "subjectSelection.checkoutStartFailed":
      "Unable to start the package checkout.",
    "subjectSelection.paymentPending":
      "Payment is still processing or your package has not been released yet.",
    "subjectSelection.subscriptionStatusFailed":
      "Unable to verify the package access status.",
    "subjectSelection.pendingBadge": "Package pending",
    "subjectSelection.pendingTitle": "Activate your package to use the platform",
    "subjectSelection.pendingDescription":
      "Your account is ready. Complete the payment to start using the app.",
    "subjectSelection.planLabel": "UBA 150-question package",
    "subjectSelection.planPrice": "Price: US$20",
    "subjectSelection.step1Title": "1. Complete payment",
    "subjectSelection.step1Description":
      "Click the button below to be redirected to the payment checkout.",
    "subjectSelection.openingCheckout": "Opening checkout...",
    "subjectSelection.subscribeNow": "Buy package now",
    "subjectSelection.step2Title": "2. Unlock package",
    "subjectSelection.step2Description":
      "After payment, log in and start using the app.",
    "subjectSelection.checking": "Checking...",
    "subjectSelection.alreadyPaid": "I already paid, refresh access",
    "subjectSelection.connectedUser": "Connected user:",
    "subjectSelection.activeAccount": "Active account",
    "subjectSelection.chooseSubject": "Choose your subject",
    "subjectSelection.exhaustedBadge": "Package used up",
    "subjectSelection.exhaustedTitle": "Buy a new package to keep generating questions",
    "subjectSelection.exhaustedDescription":
      "Your previous package has no remaining questions. We will log you out before opening Stripe checkout so your next login loads the updated access.",
    "subjectSelection.buyAnotherPackage": "Buy another package",
    "subjectSelection.viewMyAnswers": "View my answers",
    "subjectSelection.cbuUpdateRequired":
      "Your account needs a CBU update before your registration is fully up to date. Open Profile to finish your registration.",
    "subjectSelection.checkoutBlockedByCbu":
      "Update your CBU in Profile before starting the checkout.",
    "subjectSelection.openProfile": "Open Profile",

    "profile.title": "Profile",
    "profile.description":
      "Review your registration data and update it whenever needed.",
    "profile.loading": "Loading your profile...",
    "profile.loadFailed": "Unable to load your profile right now.",
    "profile.cbuPending":
      "Your account still needs a valid CBU. Update your data below to complete your registration.",
    "profile.cbuLocked":
      "Your CBU is already registered and cannot be changed here.",
    "profile.success": "Profile updated successfully.",
    "profile.saveFailed": "Unable to update your profile right now.",
    "profile.saving": "Saving...",
    "profile.submit": "Update profile",
    "profile.backToHome": "Back to home",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Splanchnology",
    "anatomy.topic.neuroanatomy": "Neuroanatomy",
    "anatomy.generateFailed": "Unable to generate a new question right now.",
    "anatomy.chooseTopic": "Choose your anatomy topic",
    "anatomy.selectedTopic": "Selected topic:",
    "anatomy.changeTopic": "Change topic",
    "anatomy.nextQuestion": "Next question",
    "biology.topic.cellularMolecular": "Cell and Molecular Biology",
    "biology.topic.genetics": "Genetics",
    "biology.generateFailed": "Unable to generate a new question right now.",
    "biology.chooseTopic": "Choose your topic",
    "biology.selectedTopic": "Selected topic:",
    "biology.changeTopic": "Change topic",
    "biology.nextQuestion": "Next question",

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
    "header.questionsThisMonth": "Preguntas de tu paquete",
    "header.usageResetDate": "Todavía te quedan {date} preguntas disponibles.",
    "header.usageResetUnavailable":
      "La cantidad de preguntas restantes todavía no está disponible.",
    "header.menu": "Menu",
    "header.limits": "Limites",
    "header.limitsUsed": "Usadas del paquete",
    "header.limitsCap": "Tamaño del paquete",
    "header.limitsReset": "Restantes",
    "header.limitsUnavailableValue": "No disponible",
    "header.language": "Idioma",
    "header.home": "Inicio",
    "header.profile": "Perfil",
    "header.myAnswers": "Mis respuestas",
    "header.feedback": "Feedback",
    "header.logOut": "Cerrar sesión",

    "footer.developedBy": "Desarrollado por Pedro Vieira",
    "footer.contact": "Contacto:",

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
      "Un paquete de 150 generaciones de preguntas sin vencimiento",
    "landing.subject.anatomy": "Anatomía",
    "landing.subject.histology": "Histología (Próximamente)",
    "landing.subject.embryology": "Embriología (Próximamente)",
    "landing.subject.biology": "Biología molecular y Genética",
    "landing.title": "UBA Trainer",
    "landing.subtitle":
      "Una plataforma para entrenarte para tus exámenes de la UBA.",
    "landing.planTitle": "Paquete de 150 preguntas",
    "landing.planPrice": "Precio: US$20",
    "landing.subjectsTitle": "Materias disponibles en la aplicación",
    "landing.createAccount": "Crear cuenta y comprar paquete",
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
      "No fue posible iniciar el checkout del paquete.",
    "register.failed": "No fue posible completar el registro.",
    "register.title": "Registro",
    "register.name": "Nombre",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.cbu": "CBU",
    "register.cbuPlaceholder": "0070010800000001234565",
    "register.cbuHelp":
      "Ingresa el CBU de 22 digitos vinculado a tu cuenta bancaria.",
    "register.password": "Contraseña",
    "register.hidePassword": "Ocultar contraseña",
    "register.showPassword": "Mostrar contraseña",
    "register.redirecting": "Redirigiendo...",
    "register.submit": "Registrarme y comprar paquete",
    "register.backToLogin": "Volver al login",

    "subjectSelection.userNotIdentified":
      "No fue posible identificar al usuario autenticado.",
    "subjectSelection.checkoutStartFailed":
      "No fue posible iniciar el checkout del paquete.",
    "subjectSelection.paymentPending":
      "El pago todavía está en procesamiento o el paquete aún no fue liberado.",
    "subjectSelection.subscriptionStatusFailed":
      "No fue posible verificar el estado del paquete.",
    "subjectSelection.pendingBadge": "Paquete pendiente",
    "subjectSelection.pendingTitle": "Activá tu paquete para usar la plataforma",
    "subjectSelection.pendingDescription":
      "Tu cuenta ya esta lista. Completá el pago para empezar a usar la aplicación.",
    "subjectSelection.planLabel": "Paquete UBA de 150 preguntas",
    "subjectSelection.planPrice": "Precio: US$20",
    "subjectSelection.step1Title": "1. Completar pago",
    "subjectSelection.step1Description":
      "Hacé clic en el botón de abajo para ser redirigido al checkout de pago.",
    "subjectSelection.openingCheckout": "Abriendo checkout...",
    "subjectSelection.subscribeNow": "Comprar paquete ahora",
    "subjectSelection.step2Title": "2. Liberar paquete",
    "subjectSelection.step2Description":
      "Después del pago, iniciá sesión y usá la aplicación.",
    "subjectSelection.checking": "Verificando...",
    "subjectSelection.alreadyPaid": "Ya pagué, actualizar acceso",
    "subjectSelection.connectedUser": "Usuario conectado:",
    "subjectSelection.activeAccount": "Cuenta activa",
    "subjectSelection.chooseSubject": "Elige tu materia",
    "subjectSelection.exhaustedBadge": "Paquete agotado",
    "subjectSelection.exhaustedTitle":
      "Compra un nuevo paquete para seguir generando preguntas",
    "subjectSelection.exhaustedDescription":
      "Tu paquete anterior ya no tiene preguntas disponibles. Cerraremos tu sesión antes de abrir el checkout de Stripe para que tu próximo login cargue el acceso actualizado.",
    "subjectSelection.buyAnotherPackage": "Comprar otro paquete",
    "subjectSelection.viewMyAnswers": "Ver mis respuestas",
    "subjectSelection.cbuUpdateRequired":
      "Tu cuenta necesita actualizar el CBU para que el registro quede completo. Abre Perfil para terminar tu registro.",
    "subjectSelection.checkoutBlockedByCbu":
      "Actualiza tu CBU en Perfil antes de iniciar el checkout.",
    "subjectSelection.openProfile": "Abrir Perfil",

    "profile.title": "Perfil",
    "profile.description":
      "Revisa los datos de tu cuenta y actualizalos cuando lo necesites.",
    "profile.loading": "Cargando tu perfil...",
    "profile.loadFailed": "No fue posible cargar tu perfil en este momento.",
    "profile.cbuPending":
      "Tu cuenta todavia necesita un CBU valido. Actualiza los datos de abajo para completar tu registro.",
    "profile.cbuLocked":
      "Tu CBU ya esta registrado y no se puede cambiar desde aqui.",
    "profile.success": "Perfil actualizado con exito.",
    "profile.saveFailed": "No fue posible actualizar tu perfil en este momento.",
    "profile.saving": "Guardando...",
    "profile.submit": "Actualizar perfil",
    "profile.backToHome": "Volver al inicio",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Esplacnología",
    "anatomy.topic.neuroanatomy": "Neuroanatomía",
    "anatomy.generateFailed":
      "No fue posible generar una nueva pregunta en este momento.",
    "anatomy.chooseTopic": "Elegí tu tema de anatomía",
    "anatomy.selectedTopic": "Tema seleccionado:",
    "anatomy.changeTopic": "Cambiar tema",
    "anatomy.nextQuestion": "Siguiente pregunta",
    "biology.topic.cellularMolecular": "Biología Celular y Molecular",
    "biology.topic.genetics": "Genética",
    "biology.generateFailed":
      "No fue posible generar una nueva pregunta en este momento.",
    "biology.chooseTopic": "Elegí tu tema",
    "biology.selectedTopic": "Tema seleccionado:",
    "biology.changeTopic": "Cambiar tema",
    "biology.nextQuestion": "Siguiente pregunta",

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
    "language.option.pt": "Português",

    "header.logoAlt": "Logo do projeto",
    "header.questionsThisMonth": "Questões do seu pacote",
    "header.usageResetDate": "Você ainda tem {date} questões disponíveis.",
    "header.usageResetUnavailable":
      "A quantidade de questões restantes ainda não está disponível.",
    "header.menu": "Menu",
    "header.limits": "Limites",
    "header.limitsUsed": "Usadas do pacote",
    "header.limitsCap": "Tamanho do pacote",
    "header.limitsReset": "Restantes",
    "header.limitsUnavailableValue": "Não disponível",
    "header.language": "Idioma",
    "header.home": "Início",
    "header.profile": "Perfil",
    "header.myAnswers": "Minhas respostas",
    "header.feedback": "Feedback",
    "header.logOut": "Sair",

    "footer.developedBy": "Desenvolvido por Pedro Vieira",
    "footer.contact": "Contato:",

    "landing.highlight.multipleChoice.title":
      "Questões de múltipla escolha geradas por IA",
    "landing.highlight.multipleChoice.description":
      "Receba perguntas de anatomia pensadas para revisão rápida e treino recorrente.",
    "landing.highlight.essays.title":
      "Questões discursivas geradas e avaliadas por IA (Em breve)",
    "landing.highlight.essays.description":
      "Receba enunciados, envie sua resposta e receba feedback com pontos de melhoria e possíveis correções de conteúdo.",
    "landing.highlight.mockExams.title": "Simulados (Em breve)",
    "landing.highlight.mockExams.description":
      "Responda perguntas em sequência para simular o comportamento de provas reais.",
    "landing.feature.questionLimit": "Um pacote com 150 gerações de perguntas sem expiração",
    "landing.subject.anatomy": "Anatomia",
    "landing.subject.histology": "Histologia (Em breve)",
    "landing.subject.embryology": "Embriologia (Em breve)",
    "landing.subject.biology": "Biologia molecular e Genética",
    "landing.title": "UBA Trainer",
    "landing.subtitle":
      "Uma plataforma para treinar para as suas provas da UBA.",
    "landing.planTitle": "Pacote de 150 perguntas",
    "landing.planPrice": "Preço: US$20",
    "landing.subjectsTitle": "Matérias disponíveis no aplicativo",
    "landing.createAccount": "Criar conta e comprar pacote",
    "landing.alreadyHaveAccount": "Já tenho conta",

    "login.invalidServerResponse": "Resposta inválida do servidor.",
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
      "A senha deve ter pelo menos 8 caracteres e incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.",

    "forgotPassword.title": "Esqueceu sua senha?",
    "forgotPassword.description":
      "Informe o email vinculado à sua conta e enviaremos um link para redefinir sua senha.",
    "forgotPassword.email": "Email",
    "forgotPassword.submit": "Enviar link de redefinição",
    "forgotPassword.submitting": "Enviando...",
    "forgotPassword.success":
      "Se o email existir, as instruções de redefinição de senha foram geradas.",
    "forgotPassword.failed":
      "Não foi possível iniciar a recuperação de senha no momento.",
    "forgotPassword.backToLogin": "Voltar para o login",

    "resetPassword.title": "Redefinir senha",
    "resetPassword.description":
      "Escolha uma nova senha para concluir a recuperação da sua conta.",
    "resetPassword.newPassword": "Nova senha",
    "resetPassword.confirmPassword": "Confirmar nova senha",
    "resetPassword.submit": "Atualizar senha",
    "resetPassword.submitting": "Atualizando...",
    "resetPassword.success": "Senha atualizada com sucesso.",
    "resetPassword.failed":
      "Não foi possível atualizar sua senha no momento.",
    "resetPassword.invalidToken":
      "O link de redefinição de senha é inválido ou já foi usado.",
    "resetPassword.passwordMismatch": "As senhas não coincidem.",
    "resetPassword.backToLogin": "Voltar para o login",

    "register.userNotIdentified":
      "Não foi possível identificar o usuário criado.",
    "register.successRedirect":
      "Cadastro realizado com sucesso. Redirecionando para o checkout...",
    "register.checkoutStartFailed":
      "Não foi possível iniciar o checkout do pacote.",
    "register.failed": "Não foi possível concluir o cadastro.",
    "register.title": "Cadastro",
    "register.name": "Nome",
    "register.email": "Email",
    "register.nickname": "Nickname",
    "register.cbu": "CBU",
    "register.cbuPlaceholder": "0070010800000001234565",
    "register.cbuHelp": "Informe o CBU de 22 digitos vinculado a sua conta bancaria.",
    "register.password": "Senha",
    "register.hidePassword": "Ocultar senha",
    "register.showPassword": "Mostrar senha",
    "register.redirecting": "Redirecionando...",
    "register.submit": "Cadastrar e comprar pacote",
    "register.backToLogin": "Voltar para o login",

    "subjectSelection.userNotIdentified":
      "Não foi possível identificar o usuário autenticado.",
    "subjectSelection.checkoutStartFailed":
      "Não foi possível iniciar o checkout do pacote.",
    "subjectSelection.paymentPending":
      "O pagamento ainda está em processamento ou o pacote ainda não foi liberado.",
    "subjectSelection.subscriptionStatusFailed":
      "Não foi possível verificar o status do pacote.",
    "subjectSelection.pendingBadge": "Pacote pendente",
    "subjectSelection.pendingTitle": "Ative seu pacote para usar a plataforma",
    "subjectSelection.pendingDescription":
      "Sua conta já esta pronta. Finalize o pagamento para começar a usar a aplicacão.",
    "subjectSelection.planLabel": "Pacote UBA de 150 perguntas",
    "subjectSelection.planPrice": "Preço: US$20",
    "subjectSelection.step1Title": "1. Concluir pagamento",
    "subjectSelection.step1Description":
      "Clique no botão abaixo para ser redirecionado ao checkout de pagamento.",
    "subjectSelection.openingCheckout": "Abrindo checkout...",
    "subjectSelection.subscribeNow": "Comprar pacote agora",
    "subjectSelection.step2Title": "2. Liberar pacote",
    "subjectSelection.step2Description":
      "Depois do pagamento, faça login e use a aplicação.",
    "subjectSelection.checking": "Verificando...",
    "subjectSelection.alreadyPaid": "Já paguei, atualizar acesso",
    "subjectSelection.connectedUser": "Usuário conectado:",
    "subjectSelection.activeAccount": "Conta ativa",
    "subjectSelection.chooseSubject": "Escolha sua matéria",
    "subjectSelection.exhaustedBadge": "Pacote esgotado",
    "subjectSelection.exhaustedTitle":
      "Compre um novo pacote para continuar gerando perguntas",
    "subjectSelection.exhaustedDescription":
      "Seu pacote anterior não tem mais questões disponíveis. Vamos encerrar sua sessão antes de abrir o checkout do Stripe para que o próximo login carregue o acesso atualizado.",
    "subjectSelection.buyAnotherPackage": "Comprar outro pacote",
    "subjectSelection.viewMyAnswers": "Ver minhas respostas",
    "subjectSelection.cbuUpdateRequired":
      "Sua conta precisa atualizar o CBU para que o cadastro fique completo. Abra Perfil para concluir o cadastro.",
    "subjectSelection.checkoutBlockedByCbu":
      "Atualize seu CBU no Perfil antes de iniciar o checkout.",
    "subjectSelection.openProfile": "Abrir Perfil",

    "profile.title": "Perfil",
    "profile.description":
      "Revise os dados da sua conta e atualize-os sempre que precisar.",
    "profile.loading": "Carregando seu perfil...",
    "profile.loadFailed": "Não foi possível carregar seu perfil agora.",
    "profile.cbuPending":
      "Sua conta ainda precisa de um CBU válido. Atualize os dados abaixo para concluir seu cadastro.",
    "profile.cbuLocked":
      "Seu CBU já está cadastrado e não pode ser alterado por aqui.",
    "profile.success": "Perfil atualizado com sucesso.",
    "profile.saveFailed": "Não foi possível atualizar seu perfil agora.",
    "profile.saving": "Salvando...",
    "profile.submit": "Atualizar perfil",
    "profile.backToHome": "Voltar para o início",

    "anatomy.topic.locomotor": "Locomotor",
    "anatomy.topic.splanchnology": "Esplacnologia",
    "anatomy.topic.neuroanatomy": "Neuroanatomia",
    "anatomy.generateFailed":
      "Não foi possível gerar uma nova pergunta no momento.",
    "anatomy.chooseTopic": "Escolha seu tema de anatomia",
    "anatomy.selectedTopic": "Tema selecionado:",
    "anatomy.changeTopic": "Trocar tema",
    "anatomy.nextQuestion": "Próxima pergunta",
    "biology.topic.cellularMolecular": "Biologia Celular e Molecular",
    "biology.topic.genetics": "Genética",
    "biology.generateFailed":
      "Não foi possível gerar uma nova pergunta no momento.",
    "biology.chooseTopic": "Escolha seu tema",
    "biology.selectedTopic": "Tema selecionado:",
    "biology.changeTopic": "Trocar tema",
    "biology.nextQuestion": "Próxima pergunta",

    "question.userNotIdentified":
      "Não foi possível identificar o usuário autenticado.",
    "question.saveFailed":
      "Não foi possível salvar sua resposta. Tente novamente.",
    "question.savingAnswer": "Salvando sua resposta...",
    "question.correct": "Correta:",
    "question.yourAnswer": "Sua resposta:",

    "answeredQuestions.userNotIdentified":
      "Não foi possível identificar o usuário autenticado.",
    "answeredQuestions.loadFailed":
      "Não foi possível carregar suas respostas no momento.",
    "answeredQuestions.badge": "Histórico do usuário",
    "answeredQuestions.title": "Questões respondidas",
    "answeredQuestions.subtitle":
      "Veja a última resposta salva em cada questão que você já respondeu.",
    "answeredQuestions.countLabel": "questões registradas",
    "answeredQuestions.emptyTitle": "Nenhuma resposta encontrada",
    "answeredQuestions.emptySubtitle":
      "Assim que você responder uma pergunta, ela vai aparecer aqui.",
    "answeredQuestions.table.question": "Questão",
    "answeredQuestions.table.subject": "Matéria",
    "answeredQuestions.table.yourAnswer": "Sua resposta",
    "answeredQuestions.table.correctAnswer": "Resposta correta",
    "answeredQuestions.table.answeredAt": "Respondida em",

    "feedback.userNotIdentified":
      "Não foi possível identificar o usuário autenticado.",
    "feedback.title": "Enviar feedback",
    "feedback.description":
      "Compartilhe sugestões, ideias ou problemas que você percebeu ao usar a plataforma.",
    "feedback.label": "Seu feedback",
    "feedback.placeholder":
      "Conte o que deixaria a plataforma melhor para você.",
    "feedback.submit": "Enviar feedback",
    "feedback.submitting": "Enviando...",
    "feedback.success": "Obrigado! Seu feedback foi enviado.",
    "feedback.failed": "Não foi possível enviar seu feedback no momento.",
    "feedback.backToHome": "Voltar para o início",
  },
};
