/**
 * IKIGAIER · El guía
 * La burbuja con la cara de Manel. No es una IA: son preguntas cerradas que
 * llevan a cada persona a lo que le sirve (test, programa gratuito, libros,
 * talleres, acompañamiento). Lo que alguien deja escrito (pedir una llamada,
 * escribir a Manel, aviso de talleres) va a la app, que se lo envía a Manel
 * por correo: https://app.ikigaier.com/api/guia/contacto.
 * Los textos se eligen según el idioma de la página (<html lang>).
 */
(function () {
  // Enlace de agenda (Google Calendar, Calendly…). Mientras esté vacío, «una
  // llamada» abre un formulario y Manel cierra día y hora por correo.
  var AGENDA_URL = '';
  var ENDPOINT = 'https://app.ikigaier.com/api/guia/contacto';
  var AVATAR = '/assets/images/guia-manel.svg?v=3';

  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  if (lang !== 'ca' && lang !== 'en') lang = 'es';

  var U = {
    es: { test: '/es/test-de-ikigai/', prog: '/es/programa-ikigai-gratis/', paso: '/es/test/', tallerGratis: '/es/talleres/taller-gratuito/', taller: '/es/taller/', empresas: '/es/talleres/empresas/', libros: '/es/libros/', libroIkigai: '/es/libros/el-ikigai-que-no-te-contaron/', ikigai: '/es/ikigai/', manel: '/es/manel-rueda/', priv: '/es/privacidad/' },
    ca: { test: '/ca/test-d-ikigai/', prog: '/ca/programa-ikigai-gratuit/', paso: '/ca/test/', tallerGratis: '/ca/tallers/taller-gratuit/', taller: '/ca/taller/', empresas: '/ca/tallers/empreses/', libros: '/ca/llibres/', libroIkigai: '/ca/llibres/el-ikigai-que-no-te-contaron/', ikigai: '/ca/ikigai/', manel: '/ca/manel-rueda/', priv: '/ca/privacitat/' },
    en: { test: '/en/ikigai-test/', prog: '/en/free-ikigai-program/', paso: '/en/test/', tallerGratis: '/en/workshops/free-workshop/', taller: '/en/workshop/', empresas: '/en/workshops/teams/', libros: '/en/books/', libroIkigai: '/en/books/el-ikigai-que-no-te-contaron/', ikigai: '/en/ikigai/', manel: '/en/manel-rueda/', priv: '/en/privacy/' }
  }[lang];

  // Cada paso: lo que dice Manel (says) y lo que se puede contestar.
  // Opción: { t: texto, go: paso } · { t, href } · los pasos con «form»
  // muestran un formulario (escribir, llamada, aviso).
  var T = {
    es: {
      chrome: { open: 'Hablar con Manel', close: 'Cerrar', title: 'Manel', sub: 'Respuestas escritas por mí. Aquí no hay IA.', restart: 'Volver a empezar', teaser: '¿Por dónde empiezo?', back: 'Volver', name: 'Tu nombre', email: 'Tu correo', phone: 'Teléfono (si prefieres que te llame)', when: '¿Qué días y horas te van mejor?', msg: 'Lo que quieras contarme', msgOpt: '¿Algo que quieras contarme antes? (opcional)', privacy: 'He leído la <a href="' + U.priv + '" target="_blank" rel="noopener">política de privacidad</a>', send: 'Enviar', sending: 'Enviando…', agenda: 'Ver mi agenda', error: 'No se ha podido enviar. Puedes escribirme a <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.', invalid: 'Revisa tu correo y marca la casilla de privacidad.' },
      steps: {
        inicio: { says: ['Hola. Soy Manel. O, al menos, mi dibujo.', 'Si estás aquí, quizá te pasa algo que no es una crisis. Es más difuso: una distancia entre cómo vives y cómo sientes que podrías vivir. Haces cosas que están bien, pero no del todo tuyas.', 'Te hago un par de preguntas y te digo por dónde empezaría yo.'],
          options: [{ t: '¿Qué voy a encontrar aquí?', go: 'sirve' }, { t: '¿Cuánto compromiso me pide?', go: 'compromiso' }, { t: 'Me gusta leer', go: 'libros' }, { t: 'Me gustaría un taller', go: 'talleres' }, { t: 'Prefiero empezar por algo gratis', go: 'gratis' }, { t: 'Quiero hablarlo con alguien', go: 'acompanar' }, { t: 'Quiero escribirte', go: 'escribir' }] },
        sirve: { says: ['Herramientas para esa distancia: un test, un programa de cuatro semanas, cuatro libros, talleres y sesiones uno a uno.', 'Lo que te llevas es concreto. Ver qué te frena y desde dónde reaccionas cuando aparece. Distinguir si un miedo te protege de algo real o solo de la incomodidad de lo nuevo.', 'Ejercicios que se hacen, no que se leen, y una libreta tuya donde queda todo. Y preguntas mejores: las que sueles aplazar porque siempre hay algo más urgente.', 'Lo que no te voy a dar es un propósito en cinco pasos ni una versión ideal de ti. El ikigai no se alcanza. Se habita.'],
          options: [{ t: '¿Cuánto compromiso me pide?', go: 'compromiso' }, { t: '¿Y cómo se empieza?', go: 'momento' }, { t: '¿Qué es ser un IKIGAIER?', go: 'que' }] },
        compromiso: { says: ['Depende de por dónde entres. Te lo digo claro.', 'El test, diez minutos. El programa, cuatro semanas: un correo al empezar cada semana, unos minutos al día y una cuenta en la app. Los libros, a tu ritmo. Los talleres, una hora el gratuito y cuatro horas el presencial. Las sesiones uno a uno, lo hablamos antes.', 'Lo que pide todo por igual es honestidad. Sin eso, ninguna herramienta sirve de mucho.'],
          options: [{ t: 'Empezar por el test', href: U.test }, { t: 'Ver el programa', href: U.prog }, { t: 'Me gusta leer', go: 'libros' }, { t: 'Me gustaría un taller', go: 'talleres' }] },
        que: { says: ['Un ikigaier es alguien que junta las dos mitades del ikigai: lo que hace y desde dónde lo hace.', 'La primera se ve: el trabajo, los proyectos, lo que consigues. La segunda casi nadie la pregunta: si estás presente en lo que haces, si te traicionas en las decisiones pequeñas.', 'Un ikigaier no elige entre las dos: aprende a moverse en las dos. No es una identidad nueva ni un club. Es una forma de estar más atenta, más honesta y más coherente con lo que eres, incluso cuando no tienes todas las respuestas.'],
          options: [{ t: '¿Y cómo se empieza?', go: 'momento' }, { t: '¿Esto para qué me sirve?', go: 'sirve' }, { t: '¿Quién eres tú?', go: 'quien' }] },
        ikigai: { says: ['Ikigai es una palabra japonesa. Viene a ser aquello que hace que la vida valga la pena.', 'El diagrama de los cuatro círculos que circula por internet no salió de Japón. Lo cuento con calma aquí, si te apetece.'],
          options: [{ t: 'Leer qué es el ikigai', href: U.ikigai }, { t: '¿Por dónde empiezo?', go: 'momento' }] },
        quien: { says: ['Escribo, doy talleres y acompaño a personas a las que, vistas desde fuera, todo les va bien, y aun así notan que algo no encaja.', 'Si quieres saber más de mí, está aquí.'],
          options: [{ t: 'Sobre Manel', href: U.manel }, { t: '¿Por dónde empiezo?', go: 'momento' }] },
        momento: { says: ['Se empieza mirando dónde estás.', 'Dime cuál se parece más a tu momento. No hay respuesta buena.'],
          options: [{ t: 'Tengo curiosidad, sin más', go: 'curiosidad' }, { t: 'Algo no encaja y no sé qué es', go: 'noencaja' }, { t: 'Sé lo que me pasa y quiero trabajarlo', go: 'acompanar' }, { t: 'Prefiero leer, a mi ritmo', go: 'libros' }] },
        curiosidad: { says: ['Entonces empieza por el test de ikigai. Son 16 preguntas, unos diez minutos, y no hace falta registrarse.', 'No te dice quién eres. Te enseña dónde estás ahora, con lo que tú mismo respondes.'],
          options: [{ t: 'Hacer el test', href: U.test }, { t: '¿Y después?', go: 'programa' }, { t: 'Otra cosa', go: 'inicio' }] },
        programa: { says: ['Si el test te deja con ganas de más, tienes el programa gratuito: «Un mes conociendo tu ikigai». Cuatro semanas que empiezan el día en que entras.', 'Para hacerlo necesitas una cuenta. Es lo único que te pido: un poco de compromiso.'],
          options: [{ t: 'Ver el programa', href: U.prog }, { t: 'Hacer el test primero', href: U.test }, { t: 'Otra cosa', go: 'inicio' }] },
        noencaja: { says: ['Eso que no encaja suele llevar tiempo ahí. Para eso hice «Un mes conociendo tu ikigai»: cuatro semanas, gratis, que empiezan el día en que entras.', 'Cada semana, un correo con una sola cosa que hacer y tu espacio en la app para escribir. Empieza con el test y acaba repitiéndolo, para ver qué se ha movido.'],
          options: [{ t: 'Ver el programa', href: U.prog }, { t: 'Prefiero hablarlo con alguien', go: 'acompanar' }, { t: 'Otra cosa', go: 'inicio' }] },
        gratis: { says: ['Hay cuatro cosas gratis, para momentos distintos:'],
          options: [{ t: 'Test de ikigai · 10 minutos', href: U.test }, { t: 'Un mes conociendo tu ikigai · 4 semanas', href: U.prog }, { t: 'Test PASO, cómo caminas · 5 minutos', href: U.paso }, { t: 'Taller gratuito · 1 hora, en grupo', href: U.tallerGratis }, { t: '¿Cuál me recomiendas?', go: 'momento' }] },
        acompanar: { says: ['Para eso está el acompañamiento uno a uno: sesiones conmigo, sobre lo que te está pasando a ti, no sobre un temario.', 'Antes de nada hablamos un rato, por teléfono o por videollamada. Sin compromiso: es para ver si tiene sentido, para ti y para mí.'],
          options: [{ t: 'Quiero esa llamada', go: 'llamada' }, { t: 'Prefiero escribirte primero', go: 'escribir' }, { t: '¿Cuánto cuesta?', go: 'precio' }, { t: 'Otra cosa', go: 'inicio' }] },
        precio: { says: ['Depende de lo que necesites y del tiempo. Te lo digo claro en la llamada, antes de empezar nada.', 'Hablar no cuesta nada.'],
          options: [{ t: 'Quiero esa llamada', go: 'llamada' }, { t: 'Prefiero escribirte', go: 'escribir' }, { t: 'Otra cosa', go: 'inicio' }] },
        libros: { says: ['Tengo cuatro libros. Cuál leer depende de lo que te pase:'],
          options: [{ t: 'Algo me frena y no sé qué es', go: 'libroNotodo' }, { t: 'Empiezo cosas y no las sostengo', go: 'libroDisciplina' }, { t: 'Quiero entender el ikigai de verdad', go: 'libroIkigai' }, { t: 'Me cuesta expresar lo que necesito', go: 'libroComunicacion' }, { t: 'Ver los cuatro', href: U.libros }] },
        libroNotodo: { says: ['Entonces «No todo lo que te frena es tuyo». Va de las frases que llevas dentro y que no escribiste tú: de dónde vienen y qué hacer con ellas.'],
          options: [{ t: 'Ver el libro', href: U.libros + '#no-todo' }, { t: 'Otra cosa', go: 'inicio' }] },
        libroDisciplina: { says: ['Entonces «Disciplina para indisciplinados». Para quien ha empezado cien lunes. Nunca fue fuerza de voluntad.'],
          options: [{ t: 'Ver el libro', href: U.libros + '#disciplina' }, { t: 'Otra cosa', go: 'inicio' }] },
        libroIkigai: { says: ['Entonces «El Ikigai que no te contaron». Lo que el diagrama de los cuatro círculos deja fuera: no solo qué haces, también desde dónde.'],
          options: [{ t: 'Ver el libro', href: U.libroIkigai }, { t: 'Otra cosa', go: 'inicio' }] },
        libroComunicacion: { says: ['Entonces «La comunicación que no te enseñaron». Para mirar cómo te hablas, expresar lo que necesitas y escuchar mejor. Con ejercicios para preparar esas conversaciones que se te hacen difíciles.'],
          options: [{ t: 'Ver el libro', href: U.libros + '#comunicacion' }, { t: 'Otra cosa', go: 'inicio' }] },
        talleres: { says: ['Hay talleres en grupo, presenciales, y talleres para equipos.'],
          options: [{ t: 'Taller gratuito · 1 hora', href: U.tallerGratis }, { t: 'Yo soy IKIGAIER · presencial, 4 horas', href: U.taller }, { t: 'Para empresas y equipos', href: U.empresas }, { t: 'Avísame de las próximas fechas', go: 'aviso' }] },
        escribir: { form: 'escribir', says: ['Escríbeme lo que quieras. Te leo yo y te contesto yo.'], done: 'Recibido. Te contesto yo, por correo.' },
        llamada: { form: 'llamada', says: ['Déjame cómo localizarte y cuándo te va mejor. Te escribo para cerrar el día y la hora.'], saysAgenda: ['Elige el día y la hora que te vayan bien.'], done: 'Recibido. Te escribo para cerrar el día y la hora.' },
        aviso: { form: 'aviso', says: ['Déjame tu correo y te aviso cuando haya fechas. Solo para eso.'], done: 'Hecho. Te aviso cuando haya fechas.' }
      }
    },
    ca: {
      chrome: { open: 'Parlar amb en Manel', close: 'Tancar', title: 'Manel', sub: 'Respostes escrites per mi. Aquí no hi ha IA.', restart: 'Tornar a començar', teaser: 'Per on començo?', back: 'Tornar', name: 'El teu nom', email: 'El teu correu', phone: 'Telèfon (si prefereixes que et truqui)', when: 'Quins dies i hores et van millor?', msg: 'El que em vulguis explicar', msgOpt: 'Alguna cosa que em vulguis explicar abans? (opcional)', privacy: 'He llegit la <a href="' + U.priv + '" target="_blank" rel="noopener">política de privacitat</a>', send: 'Enviar', sending: 'Enviant…', agenda: 'Veure la meva agenda', error: 'No s’ha pogut enviar. Em pots escriure a <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.', invalid: 'Revisa el correu i marca la casella de privacitat.' },
      steps: {
        inicio: { says: ['Hola. Soc en Manel. O, si més no, el meu dibuix.', 'Si ets aquí, potser et passa una cosa que no és una crisi. És més difusa: una distància entre com vius i com sents que podries viure. Fas coses que estan bé, però no del tot teves.', 'Et faig un parell de preguntes i et dic per on començaria jo.'],
          options: [{ t: 'Què hi trobaré, aquí?', go: 'sirve' }, { t: 'Quant compromís em demana?', go: 'compromiso' }, { t: 'M’agrada llegir', go: 'libros' }, { t: 'M’agradaria un taller', go: 'talleres' }, { t: 'Prefereixo començar per alguna cosa gratuïta', go: 'gratis' }, { t: 'Vull parlar-ho amb algú', go: 'acompanar' }, { t: 'Et vull escriure', go: 'escribir' }] },
        sirve: { says: ['Eines per a aquesta distància: un test, un programa de quatre setmanes, quatre llibres, tallers i sessions d’u a u.', 'El que t’emportes és concret. Veure què et frena i des d’on reacciones quan apareix. Distingir si una por et protegeix d’alguna cosa real o només de la incomoditat del que és nou.', 'Exercicis que es fan, no que es llegeixen, i una llibreta teva on queda tot. I preguntes millors: les que sols ajornar perquè sempre hi ha alguna cosa més urgent.', 'El que no et donaré és un propòsit en cinc passos ni una versió ideal de tu. L’ikigai no s’assoleix. S’habita.'],
          options: [{ t: 'Quant compromís em demana?', go: 'compromiso' }, { t: 'I com es comença?', go: 'momento' }, { t: 'Què és ser un IKIGAIER?', go: 'que' }] },
        compromiso: { says: ['Depèn de per on hi entris. T’ho dic clar.', 'El test, deu minuts. El programa, quatre setmanes: un correu en començar cada setmana, uns minuts al dia i un compte a l’app. Els llibres, al teu ritme. Els tallers, una hora el gratuït i quatre hores el presencial. Les sessions d’u a u, ho parlem abans.', 'El que demana tot per igual és honestedat. Sense això, cap eina no serveix de gaire.'],
          options: [{ t: 'Començar pel test', href: U.test }, { t: 'Veure el programa', href: U.prog }, { t: 'M’agrada llegir', go: 'libros' }, { t: 'M’agradaria un taller', go: 'talleres' }] },
        que: { says: ['Un ikigaier és algú que ajunta les dues meitats de l’ikigai: el que fa i des d’on ho fa.', 'La primera es veu: la feina, els projectes, el que aconsegueixes. La segona gairebé ningú no la pregunta: si ets present en el que fas, si et traeixes en les decisions petites.', 'Un ikigaier no tria entre les dues: aprèn a moure’s en totes dues. No és una identitat nova ni un club. És una manera d’estar més atenta, més honesta i més coherent amb el que ets, fins i tot quan no tens totes les respostes.'],
          options: [{ t: 'I com es comença?', go: 'momento' }, { t: 'Això per a què em serveix?', go: 'sirve' }, { t: 'Qui ets tu?', go: 'quien' }] },
        ikigai: { says: ['Ikigai és una paraula japonesa. Ve a ser allò que fa que la vida valgui la pena.', 'El diagrama dels quatre cercles que circula per internet no va sortir del Japó. Ho explico amb calma aquí, si et ve de gust.'],
          options: [{ t: 'Llegir què és l’ikigai', href: U.ikigai }, { t: 'Per on començo?', go: 'momento' }] },
        quien: { says: ['Escric, faig tallers i acompanyo persones a qui, vistes des de fora, tot els va bé, i tot i així noten que alguna cosa no encaixa.', 'Si vols saber més de mi, és aquí.'],
          options: [{ t: 'Sobre en Manel', href: U.manel }, { t: 'Per on començo?', go: 'momento' }] },
        momento: { says: ['Es comença mirant on ets.', 'Digues-me quina s’assembla més al teu moment. No hi ha resposta bona.'],
          options: [{ t: 'Tinc curiositat, i prou', go: 'curiosidad' }, { t: 'Alguna cosa no encaixa i no sé què és', go: 'noencaja' }, { t: 'Sé què em passa i ho vull treballar', go: 'acompanar' }, { t: 'Prefereixo llegir, al meu ritme', go: 'libros' }] },
        curiosidad: { says: ['Doncs comença pel test d’ikigai. Són 16 preguntes, uns deu minuts, i no cal registrar-se.', 'No et diu qui ets. T’ensenya on ets ara, amb el que tu mateix respons.'],
          options: [{ t: 'Fer el test', href: U.test }, { t: 'I després?', go: 'programa' }, { t: 'Una altra cosa', go: 'inicio' }] },
        programa: { says: ['Si el test et deixa amb ganes de més, tens el programa gratuït: «Un mes coneixent el teu ikigai». Quatre setmanes que comencen el dia que hi entres.', 'Per fer-lo necessites un compte. És l’única cosa que et demano: una mica de compromís.'],
          options: [{ t: 'Veure el programa', href: U.prog }, { t: 'Fer primer el test', href: U.test }, { t: 'Una altra cosa', go: 'inicio' }] },
        noencaja: { says: ['Això que no encaixa sol fer temps que hi és. Per això vaig fer «Un mes coneixent el teu ikigai»: quatre setmanes, gratis, que comencen el dia que hi entres.', 'Cada setmana, un correu amb una sola cosa per fer i el teu espai a l’app per escriure. Comença amb el test i acaba repetint-lo, per veure què s’ha mogut.'],
          options: [{ t: 'Veure el programa', href: U.prog }, { t: 'Prefereixo parlar-ho amb algú', go: 'acompanar' }, { t: 'Una altra cosa', go: 'inicio' }] },
        gratis: { says: ['Hi ha quatre coses gratuïtes, per a moments diferents:'],
          options: [{ t: 'Test d’ikigai · 10 minuts', href: U.test }, { t: 'Un mes coneixent el teu ikigai · 4 setmanes', href: U.prog }, { t: 'Test PASO, com camines · 5 minuts', href: U.paso }, { t: 'Taller gratuït · 1 hora, en grup', href: U.tallerGratis }, { t: 'Quin em recomanes?', go: 'momento' }] },
        acompanar: { says: ['Per a això hi ha l’acompanyament d’u a u: sessions amb mi, sobre el que et passa a tu, no sobre un temari.', 'Abans de res parlem una estona, per telèfon o per videotrucada. Sense compromís: és per veure si té sentit, per a tu i per a mi.'],
          options: [{ t: 'Vull aquesta trucada', go: 'llamada' }, { t: 'Prefereixo escriure’t primer', go: 'escribir' }, { t: 'Quant costa?', go: 'precio' }, { t: 'Una altra cosa', go: 'inicio' }] },
        precio: { says: ['Depèn del que necessitis i del temps. T’ho dic clar a la trucada, abans de començar res.', 'Parlar no costa res.'],
          options: [{ t: 'Vull aquesta trucada', go: 'llamada' }, { t: 'Prefereixo escriure’t', go: 'escribir' }, { t: 'Una altra cosa', go: 'inicio' }] },
        libros: { says: ['Tinc quatre llibres. Quin llegir depèn del que et passi:'],
          options: [{ t: 'Alguna cosa em frena i no sé què és', go: 'libroNotodo' }, { t: 'Començo coses i no les sostinc', go: 'libroDisciplina' }, { t: 'Vull entendre l’ikigai de debò', go: 'libroIkigai' }, { t: 'Em costa expressar el que necessito', go: 'libroComunicacion' }, { t: 'Veure’ls tots quatre', href: U.libros }] },
        libroNotodo: { says: ['Doncs «No todo lo que te frena es tuyo». Va de les frases que portes a dins i que no vas escriure tu: d’on vénen i què fer-ne.'],
          options: [{ t: 'Veure el llibre', href: U.libros + '#no-todo' }, { t: 'Una altra cosa', go: 'inicio' }] },
        libroDisciplina: { says: ['Doncs «Disciplina para indisciplinados». Per a qui ha començat cent dilluns. Mai no va ser força de voluntat.'],
          options: [{ t: 'Veure el llibre', href: U.libros + '#disciplina' }, { t: 'Una altra cosa', go: 'inicio' }] },
        libroIkigai: { says: ['Doncs «El Ikigai que no te contaron». El que el diagrama dels quatre cercles deixa fora: no només què fas, també des d’on.'],
          options: [{ t: 'Veure el llibre', href: U.libroIkigai }, { t: 'Una altra cosa', go: 'inicio' }] },
        libroComunicacion: { says: ['Doncs «La comunicación que no te enseñaron». Per mirar com et parles, expressar el que necessites i escoltar millor. Amb exercicis per preparar les converses que se’t fan difícils.'],
          options: [{ t: 'Veure el llibre', href: U.libros + '#comunicacion' }, { t: 'Una altra cosa', go: 'inicio' }] },
        talleres: { says: ['Hi ha tallers en grup, presencials, i tallers per a equips.'],
          options: [{ t: 'Taller gratuït · 1 hora', href: U.tallerGratis }, { t: 'Jo soc IKIGAIER · presencial, 4 hores', href: U.taller }, { t: 'Per a empreses i equips', href: U.empresas }, { t: 'Avisa’m de les properes dates', go: 'aviso' }] },
        escribir: { form: 'escribir', says: ['Escriu-me el que vulguis. Et llegeixo jo i et contesto jo.'], done: 'Rebut. Et contesto jo, per correu.' },
        llamada: { form: 'llamada', says: ['Deixa’m com et puc localitzar i quan et va millor. T’escric per tancar el dia i l’hora.'], saysAgenda: ['Tria el dia i l’hora que et vagin bé.'], done: 'Rebut. T’escric per tancar el dia i l’hora.' },
        aviso: { form: 'aviso', says: ['Deixa’m el teu correu i t’aviso quan hi hagi dates. Només per a això.'], done: 'Fet. T’aviso quan hi hagi dates.' }
      }
    },
    en: {
      chrome: { open: 'Talk to Manel', close: 'Close', title: 'Manel', sub: 'Answers written by me. No AI here.', restart: 'Start again', teaser: 'Where do I start?', back: 'Back', name: 'Your name', email: 'Your email', phone: 'Phone (if you’d rather I call you)', when: 'Which days and times suit you best?', msg: 'Whatever you want to tell me', msgOpt: 'Anything you’d like to tell me first? (optional)', privacy: 'I have read the <a href="' + U.priv + '" target="_blank" rel="noopener">privacy policy</a>', send: 'Send', sending: 'Sending…', agenda: 'See my calendar', error: 'It couldn’t be sent. You can write to me at <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.', invalid: 'Check your email and tick the privacy box.' },
      steps: {
        inicio: { says: ['Hello. I’m Manel. Or at least my drawing.', 'If you’re here, maybe something is going on that isn’t a crisis. It’s vaguer than that: a distance between how you live and how you feel you could live. You do things that are fine, but not quite yours.', 'I’ll ask you a couple of questions and tell you where I’d start.'],
          options: [{ t: 'What will I find here?', go: 'sirve' }, { t: 'How much commitment does it take?', go: 'compromiso' }, { t: 'I like reading', go: 'libros' }, { t: 'I’d like a workshop', go: 'talleres' }, { t: 'I’d rather start with something free', go: 'gratis' }, { t: 'I want to talk it through with someone', go: 'acompanar' }, { t: 'I’d like to write to you', go: 'escribir' }] },
        sirve: { says: ['Tools for that distance: a test, a four-week programme, four books, workshops and one-to-one sessions.', 'What you take away is concrete. Seeing what holds you back and where you react from when it shows up. Telling whether a fear is protecting you from something real or only from the discomfort of the new.', 'Exercises you do, not just read, and a notebook of your own where it all stays. And better questions: the ones you tend to put off because there’s always something more urgent.', 'What I won’t give you is a purpose in five steps or an ideal version of yourself. Ikigai isn’t reached. It’s lived in.'],
          options: [{ t: 'How much commitment does it take?', go: 'compromiso' }, { t: 'And how do you start?', go: 'momento' }, { t: 'What does it mean to be an IKIGAIER?', go: 'que' }] },
        compromiso: { says: ['It depends on where you come in. I’ll be straight with you.', 'The test, ten minutes. The programme, four weeks: an email at the start of each week, a few minutes a day and an account in the app. The books, at your own pace. The workshops, one hour for the free one and four hours in person. One-to-one sessions, we talk it through first.', 'What all of it asks for equally is honesty. Without that, no tool is much use.'],
          options: [{ t: 'Start with the test', href: U.test }, { t: 'See the programme', href: U.prog }, { t: 'I like reading', go: 'libros' }, { t: 'I’d like a workshop', go: 'talleres' }] },
        que: { says: ['An ikigaier is someone who brings together the two halves of ikigai: what they do, and where they do it from.', 'The first is visible: work, projects, what you achieve. The second, hardly anyone asks about: whether you’re present in what you do, whether you betray yourself in the small decisions.', 'An ikigaier doesn’t choose between them: they learn to move in both. It isn’t a new identity or a club. It’s a way of being more attentive, more honest and more true to who you are, even when you don’t have all the answers.'],
          options: [{ t: 'And how do you start?', go: 'momento' }, { t: 'What is this good for?', go: 'sirve' }, { t: 'Who are you?', go: 'quien' }] },
        ikigai: { says: ['Ikigai is a Japanese word. Roughly, it’s what makes life worth living.', 'The four-circle diagram you see online didn’t come from Japan. I explain it calmly here, if you feel like reading.'],
          options: [{ t: 'Read what ikigai is', href: U.ikigai }, { t: 'Where do I start?', go: 'momento' }] },
        quien: { says: ['I write, run workshops and work with people whose lives look fine from the outside, and who still feel something doesn’t fit.', 'If you want to know more about me, it’s here.'],
          options: [{ t: 'About Manel', href: U.manel }, { t: 'Where do I start?', go: 'momento' }] },
        momento: { says: ['You start by looking at where you are.', 'Tell me which is closest to where you are. There’s no right answer.'],
          options: [{ t: 'I’m just curious', go: 'curiosidad' }, { t: 'Something doesn’t fit and I don’t know what', go: 'noencaja' }, { t: 'I know what’s going on and want to work on it', go: 'acompanar' }, { t: 'I’d rather read, at my own pace', go: 'libros' }] },
        curiosidad: { says: ['Then start with the ikigai test. Sixteen questions, about ten minutes, no sign-up.', 'It doesn’t tell you who you are. It shows you where you are now, from your own answers.'],
          options: [{ t: 'Take the test', href: U.test }, { t: 'And then?', go: 'programa' }, { t: 'Something else', go: 'inicio' }] },
        programa: { says: ['If the test leaves you wanting more, there’s the free programme: “A month getting to know your ikigai”. Four weeks that start the day you join.', 'You need an account to do it. It’s the only thing I ask: a little commitment.'],
          options: [{ t: 'See the programme', href: U.prog }, { t: 'Take the test first', href: U.test }, { t: 'Something else', go: 'inicio' }] },
        noencaja: { says: ['Whatever doesn’t fit has usually been there a while. That’s why I made “A month getting to know your ikigai”: four free weeks that start the day you join.', 'Each week, one email with one thing to do, and your own space in the app to write. It starts with the test and ends by repeating it, to see what has moved.'],
          options: [{ t: 'See the programme', href: U.prog }, { t: 'I’d rather talk it through with someone', go: 'acompanar' }, { t: 'Something else', go: 'inicio' }] },
        gratis: { says: ['There are four free things, for different moments:'],
          options: [{ t: 'Ikigai test · 10 minutes', href: U.test }, { t: 'A month getting to know your ikigai · 4 weeks', href: U.prog }, { t: 'PASO test, how you walk · 5 minutes', href: U.paso }, { t: 'Free workshop · 1 hour, in a group', href: U.tallerGratis }, { t: 'Which would you recommend?', go: 'momento' }] },
        acompanar: { says: ['That’s what one-to-one guidance is for: sessions with me, about what is happening to you, not about a syllabus.', 'First we talk for a while, by phone or video call. No commitment: it’s to see whether it makes sense, for you and for me.'],
          options: [{ t: 'I’d like that call', go: 'llamada' }, { t: 'I’d rather write to you first', go: 'escribir' }, { t: 'How much does it cost?', go: 'precio' }, { t: 'Something else', go: 'inicio' }] },
        precio: { says: ['It depends on what you need and how long. I’ll tell you clearly on the call, before anything starts.', 'Talking costs nothing.'],
          options: [{ t: 'I’d like that call', go: 'llamada' }, { t: 'I’d rather write to you', go: 'escribir' }, { t: 'Something else', go: 'inicio' }] },
        libros: { says: ['I have four books (in Spanish). Which one depends on what’s going on:'],
          options: [{ t: 'Something holds me back and I don’t know what', go: 'libroNotodo' }, { t: 'I start things and don’t keep them up', go: 'libroDisciplina' }, { t: 'I want to really understand ikigai', go: 'libroIkigai' }, { t: 'I find it hard to express what I need', go: 'libroComunicacion' }, { t: 'See all four', href: U.libros }] },
        libroNotodo: { says: ['Then «No todo lo que te frena es tuyo». It’s about the sentences you carry inside that you didn’t write: where they come from and what to do with them.'],
          options: [{ t: 'See the book', href: U.libros + '#no-todo' }, { t: 'Something else', go: 'inicio' }] },
        libroDisciplina: { says: ['Then «Disciplina para indisciplinados». For anyone who has started a hundred Mondays. It was never willpower.'],
          options: [{ t: 'See the book', href: U.libros + '#disciplina' }, { t: 'Something else', go: 'inicio' }] },
        libroIkigai: { says: ['Then «El Ikigai que no te contaron». What the four-circle diagram leaves out: not only what you do, but where you do it from.'],
          options: [{ t: 'See the book', href: U.libroIkigai }, { t: 'Something else', go: 'inicio' }] },
        libroComunicacion: { says: ['Then «La comunicación que no te enseñaron» (in Spanish). Explore how you talk to yourself, express what you need and listen more closely. With exercises to prepare for conversations you find difficult.'],
          options: [{ t: 'See the book', href: U.libros + '#comunicacion' }, { t: 'Something else', go: 'inicio' }] },
        talleres: { says: ['There are in-person group workshops, and workshops for teams.'],
          options: [{ t: 'Free workshop · 1 hour', href: U.tallerGratis }, { t: 'I am IKIGAIER · in person, 4 hours', href: U.taller }, { t: 'For companies and teams', href: U.empresas }, { t: 'Let me know about the next dates', go: 'aviso' }] },
        escribir: { form: 'escribir', says: ['Write me whatever you like. I read it myself and I answer it myself.'], done: 'Received. I’ll answer you myself, by email.' },
        llamada: { form: 'llamada', says: ['Tell me how to reach you and when suits you best. I’ll write to agree on a day and time.'], saysAgenda: ['Choose a day and time that suit you.'], done: 'Received. I’ll write to agree on a day and time.' },
        aviso: { form: 'aviso', says: ['Leave me your email and I’ll let you know when there are dates. Only for that.'], done: 'Done. I’ll let you know when there are dates.' }
      }
    }
  }[lang];

  var C = T.chrome;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ruta = [];
  var opened = false;

  function store(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; }
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // ── Estilos ───────────────────────────────────────────────
  var css = '' +
    '.guia-btn{position:fixed;right:20px;bottom:calc(20px + var(--guia-up,0px));z-index:9000;width:64px;height:64px;border-radius:50%;border:1px solid rgba(39,39,39,.14);background:#F2E8D5;box-shadow:0 6px 20px rgba(39,39,39,.18);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:transform .2s ease}' +
    '.guia-btn:hover{transform:translateY(-2px)}' +
    '.guia-btn:focus-visible,.guia a:focus-visible,.guia button:focus-visible,.guia input:focus-visible,.guia textarea:focus-visible{outline:2px solid #94583E;outline-offset:2px}' +
    '.guia-btn img{width:54px;height:54px}' +
    '.guia-teaser{position:fixed;right:96px;bottom:calc(36px + var(--guia-up,0px));z-index:9000;background:#FCFAF7;color:#272727;font:400 14px/1.3 Inter,system-ui,sans-serif;padding:9px 14px;border-radius:16px 16px 4px 16px;box-shadow:0 4px 16px rgba(39,39,39,.12);cursor:pointer;opacity:0;transform:translateY(6px);transition:opacity .4s ease,transform .4s ease;pointer-events:none}' +
    '.guia-teaser.on{opacity:1;transform:none;pointer-events:auto}' +
    '.guia{position:fixed;right:20px;bottom:calc(96px + var(--guia-up,0px));z-index:10000;width:370px;max-width:calc(100vw - 32px);height:min(600px,calc(100vh - 120px - var(--guia-up,0px)));background:#FCFAF7;color:#272727;border-radius:18px;box-shadow:0 18px 50px rgba(39,39,39,.25);display:none;flex-direction:column;overflow:hidden;font:400 15px/1.55 Inter,system-ui,sans-serif}' +
    '.guia.on{display:flex}' +
    '.guia-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(39,39,39,.08);background:#F2E8D5}' +
    '.guia-head img{width:40px;height:40px}' +
    '.guia-head b{display:block;font:500 20px/1.1 "Cormorant Garamond",Georgia,serif}' +
    '.guia-head small{display:block;font-size:12px;color:#655F59}' +
    '.guia-head .guia-x{margin-left:auto;background:none;border:0;font-size:24px;line-height:1;color:#655F59;cursor:pointer;padding:6px 8px;border-radius:8px}' +
    '.guia-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}' +
    '.guia-m{max-width:88%;padding:10px 14px;border-radius:4px 16px 16px 16px;background:#F2E8D5;color:#3A2A15;font-family:"Cormorant Garamond",Georgia,serif;font-size:18px;line-height:1.4;animation:guiaIn .35s ease both}' +
    '.guia-u{align-self:flex-end;max-width:85%;padding:8px 13px;border-radius:16px 4px 16px 16px;background:#272727;color:#F5F2ED;font-size:14px;animation:guiaIn .25s ease both}' +
    '.guia-ops{display:flex;flex-direction:column;align-items:flex-start;gap:7px;margin-top:2px;animation:guiaIn .35s ease both}' +
    '.guia-op{background:#FCFAF7;border:1px solid #C2866B;color:#94583E;border-radius:999px;padding:7px 14px;font:400 14px/1.3 Inter,system-ui,sans-serif;cursor:pointer;text-align:left;text-decoration:none;transition:background .15s ease}' +
    '.guia-op:hover{background:#F5ECE4}' +
    'a.guia-op::after{content:" \\2197";font-size:12px}' +
    '.guia-typing{display:inline-flex;gap:4px;padding:12px 14px;background:#F2E8D5;border-radius:4px 16px 16px 16px;align-self:flex-start}' +
    '.guia-typing i{width:6px;height:6px;border-radius:50%;background:#94583E;opacity:.4;animation:guiaDot 1s infinite}' +
    '.guia-typing i:nth-child(2){animation-delay:.15s}.guia-typing i:nth-child(3){animation-delay:.3s}' +
    '.guia-form{display:flex;flex-direction:column;gap:8px;animation:guiaIn .35s ease both}' +
    '.guia-form input[type=text],.guia-form input[type=email],.guia-form input[type=tel],.guia-form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(39,39,39,.2);border-radius:10px;padding:9px 12px;font:400 14px/1.4 Inter,system-ui,sans-serif;background:#fff;color:#272727}' +
    '.guia-form textarea{min-height:84px;resize:vertical}' +
    '.guia-form label.guia-ok{display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#655F59}' +
    '.guia-form label.guia-ok a{color:#94583E}' +
    '.guia-form .guia-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}' +
    '.guia-send{align-self:flex-start;background:#272727;color:#F5F2ED;border:0;border-radius:999px;padding:9px 20px;font:500 13px/1 Inter,system-ui,sans-serif;letter-spacing:.08em;cursor:pointer}' +
    '.guia-send[disabled]{opacity:.5;cursor:default}' +
    '.guia-err{font-size:13px;color:#94583E}.guia-err a{color:#94583E}' +
    '.guia-foot{padding:8px 16px 12px;border-top:1px solid rgba(39,39,39,.06);text-align:center}' +
    '.guia-foot button{background:none;border:0;color:#655F59;font:400 12px Inter,system-ui,sans-serif;letter-spacing:.06em;cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '@keyframes guiaIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '@keyframes guiaDot{0%,100%{opacity:.25}50%{opacity:.9}}' +
    '@media (max-width:520px){.guia{right:8px;left:8px;width:auto;max-width:none;bottom:calc(88px + var(--guia-up,0px));height:calc(100vh - 110px - var(--guia-up,0px))}.guia-btn{right:14px;bottom:calc(14px + var(--guia-up,0px))}.guia-teaser{right:88px;bottom:calc(30px + var(--guia-up,0px))}}' +
    '@media (prefers-reduced-motion:reduce){.guia-m,.guia-u,.guia-ops,.guia-form,.guia-teaser{animation:none;transition:none}}';
  var st = el('style'); st.textContent = css; document.head.appendChild(st);

  // ── Estructura ────────────────────────────────────────────
  var btn = el('button', 'guia-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', C.open);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'guia');
  btn.innerHTML = '<img src="' + AVATAR + '" alt="" width="54" height="54">';

  var teaser = el('div', 'guia-teaser', C.teaser);
  teaser.setAttribute('aria-hidden', 'true');

  var panel = el('div', 'guia');
  panel.id = 'guia';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', C.open);
  panel.innerHTML =
    '<div class="guia-head"><img src="' + AVATAR + '" alt="" width="40" height="40"><div><b>' + C.title + '</b><small>' + C.sub + '</small></div>' +
    '<button type="button" class="guia-x" aria-label="' + C.close + '">&times;</button></div>' +
    '<div class="guia-log" aria-live="polite"></div>' +
    '<div class="guia-foot"><button type="button" class="guia-restart">' + C.restart + '</button></div>';
  var log = panel.querySelector('.guia-log');

  document.body.appendChild(teaser);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  // ── Conversación ──────────────────────────────────────────
  var turno = 0; // invalida los mensajes en espera si se reinicia

  function bajar() { log.scrollTop = log.scrollHeight; }

  function decir(textos, then) {
    var mio = turno;
    var i = 0;
    (function sig() {
      if (mio !== turno) return;
      if (i >= textos.length) { then && then(); return; }
      var txt = textos[i++];
      if (reduce) { log.appendChild(el('div', 'guia-m', txt)); bajar(); sig(); return; }
      var typing = el('div', 'guia-typing', '<i></i><i></i><i></i>');
      log.appendChild(typing); bajar();
      setTimeout(function () {
        if (mio !== turno) return;
        typing.remove();
        log.appendChild(el('div', 'guia-m', txt)); bajar();
        sig();
      }, Math.min(1400, 450 + txt.length * 9));
    })();
  }

  function ir(id) {
    var paso = T.steps[id];
    if (!paso) return;
    if (paso.form === 'llamada' && AGENDA_URL) {
      decir(paso.saysAgenda, function () { opciones([{ t: C.agenda, href: AGENDA_URL }, { t: C.back, go: 'inicio' }]); });
      return;
    }
    decir(paso.says, function () {
      if (paso.form) formulario(paso);
      else opciones(paso.options);
    });
  }

  function opciones(ops) {
    var box = el('div', 'guia-ops');
    ops.forEach(function (o) {
      var b;
      if (o.href) {
        b = el('a', 'guia-op', o.t);
        b.href = o.href;
        if (/^https?:/.test(o.href)) { b.target = '_blank'; b.rel = 'noopener'; }
        b.addEventListener('click', function () { ruta.push(o.t); store('guia-ruta', JSON.stringify(ruta)); });
      } else {
        b = el('button', 'guia-op', o.t);
        b.type = 'button';
        b.addEventListener('click', function () {
          box.remove();
          log.appendChild(el('div', 'guia-u', o.t)); bajar();
          ruta.push(o.t);
          ir(o.go);
        });
      }
      box.appendChild(b);
    });
    log.appendChild(box); bajar();
    var first = box.querySelector('.guia-op');
    if (first && opened) first.focus({ preventScroll: true });
  }

  function campo(tipo, name, ph, req) {
    var i = el(tipo === 'textarea' ? 'textarea' : 'input');
    if (tipo !== 'textarea') i.type = tipo;
    i.name = name; i.placeholder = ph; i.setAttribute('aria-label', ph);
    if (req) i.required = true;
    if (name === 'email') i.autocomplete = 'email';
    if (name === 'nombre') i.autocomplete = 'name';
    if (name === 'telefono') i.autocomplete = 'tel';
    return i;
  }

  function formulario(paso) {
    var tipo = paso.form;
    var f = el('form', 'guia-form');
    f.noValidate = true;
    if (tipo !== 'aviso') f.appendChild(campo('text', 'nombre', C.name, true));
    f.appendChild(campo('email', 'email', C.email, true));
    if (tipo === 'llamada') {
      f.appendChild(campo('tel', 'telefono', C.phone, false));
      f.appendChild(campo('text', 'cuando', C.when, false));
      f.appendChild(campo('textarea', 'mensaje', C.msgOpt, false));
    }
    if (tipo === 'escribir') f.appendChild(campo('textarea', 'mensaje', C.msg, true));
    var hp = el('input', 'guia-hp'); hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
    f.appendChild(hp);
    var ok = el('label', 'guia-ok', '<input type="checkbox" name="privacidad" required> <span>' + C.privacy + '</span>');
    f.appendChild(ok);
    var send = el('button', 'guia-send', C.send); send.type = 'submit';
    f.appendChild(send);
    var err = el('div', 'guia-err'); err.setAttribute('role', 'alert');
    f.appendChild(err);
    var otra = el('div', 'guia-ops');
    var volver = el('button', 'guia-op', C.back); volver.type = 'button';
    volver.addEventListener('click', function () { f.remove(); otra.remove(); ruta.push(C.back); ir('inicio'); });
    otra.appendChild(volver);

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var x = f.elements[n]; return x ? x.value.trim() : ''; };
      var email = v('email');
      var faltan = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !f.elements.privacidad.checked ||
        (tipo !== 'aviso' && v('nombre').length < 2) || (tipo === 'escribir' && v('mensaje').length < 2);
      if (faltan) { err.innerHTML = C.invalid; return; }
      err.innerHTML = '';
      send.disabled = true; send.textContent = C.sending;
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipo, nombre: v('nombre'), email: email, telefono: v('telefono'), cuando: v('cuando'),
          mensaje: v('mensaje'), website: v('website'), privacidad: true,
          ruta: ruta, pagina: location.pathname, lang: lang
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error('send'); }); })
        .then(function () {
          f.remove(); otra.remove();
          ruta.push('✓');
          decir([paso.done], function () { opciones([{ t: C.restart, go: 'inicio' }]); });
        })
        .catch(function () {
          send.disabled = false; send.textContent = C.send;
          err.innerHTML = C.error;
        });
    });

    log.appendChild(f);
    log.appendChild(otra);
    bajar();
    var first = f.querySelector('input,textarea');
    if (first && opened) first.focus({ preventScroll: true });
  }

  function empezar() {
    turno++;
    ruta = [];
    log.innerHTML = '';
    ir('inicio');
  }

  // ── Abrir y cerrar ────────────────────────────────────────
  var empezado = false;
  function abrir() {
    opened = true;
    panel.classList.add('on');
    teaser.classList.remove('on');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', C.close);
    store('guia-visto', '1');
    if (!empezado) { empezado = true; empezar(); }
    else { var f = log.querySelector('.guia-op,input,textarea'); if (f) f.focus({ preventScroll: true }); }
  }
  function cerrar() {
    opened = false;
    panel.classList.remove('on');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', C.open);
    btn.focus();
  }

  btn.addEventListener('click', function () { opened ? cerrar() : abrir(); });
  teaser.addEventListener('click', abrir);
  panel.querySelector('.guia-x').addEventListener('click', cerrar);
  panel.querySelector('.guia-restart').addEventListener('click', empezar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) cerrar(); });

  // Si el aviso de cookies (abajo, fijo) la tapa, la burbuja se coloca encima.
  function ajustar() {
    var ck = document.querySelector('.iki-cookies');
    var up = ck && ck.getClientRects().length && ck.getBoundingClientRect().right > window.innerWidth - 96 ? ck.offsetHeight + 12 : 0;
    document.documentElement.style.setProperty('--guia-up', up + 'px');
  }
  ajustar();
  if (window.MutationObserver) new MutationObserver(ajustar).observe(document.body, { childList: true });
  window.addEventListener('resize', ajustar);

  // Una sola invitación por visita, a los pocos segundos, y nada si ya lo abrió.
  if (!store('guia-visto')) {
    setTimeout(function () {
      if (opened) return;
      store('guia-visto', '1');
      teaser.classList.add('on');
      setTimeout(function () { teaser.classList.remove('on'); }, 9000);
    }, 6000);
  }
})();
