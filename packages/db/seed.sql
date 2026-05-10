-- Antiport: seed inicial
-- 20 dominios placeholder y 30 versículos.
-- Ejecutar tras 0001_init.sql y 0002_rls.sql.
-- (Las inserciones aquí asumen ejecución como service_role / superuser.)

-- ==========================================================================
-- blocklist_domains: 20 placeholders TLD .invalid (RFC 6761, jamás resuelven)
-- ==========================================================================
insert into public.blocklist_domains (domain, category, severity) values
  ('example-blocked-1.invalid',  'adult', 3),
  ('example-blocked-2.invalid',  'adult', 3),
  ('example-blocked-3.invalid',  'adult', 3),
  ('example-blocked-4.invalid',  'adult', 3),
  ('example-blocked-5.invalid',  'adult', 3),
  ('example-blocked-6.invalid',  'adult', 3),
  ('example-blocked-7.invalid',  'adult', 3),
  ('example-blocked-8.invalid',  'adult', 3),
  ('example-blocked-9.invalid',  'adult', 3),
  ('example-blocked-10.invalid', 'adult', 3),
  ('example-blocked-11.invalid', 'adult', 2),
  ('example-blocked-12.invalid', 'adult', 2),
  ('example-blocked-13.invalid', 'adult', 2),
  ('example-blocked-14.invalid', 'adult', 2),
  ('example-blocked-15.invalid', 'adult', 2),
  ('example-blocked-16.invalid', 'adult', 1),
  ('example-blocked-17.invalid', 'adult', 1),
  ('example-blocked-18.invalid', 'adult', 1),
  ('example-blocked-19.invalid', 'adult', 1),
  ('example-blocked-20.invalid', 'adult', 1)
on conflict (domain) do nothing;

-- ==========================================================================
-- scriptures: 30 versículos (RVR1960 / NVI, dominio público en versiones clásicas)
-- Temas: esperanza, identidad, autocontrol, descanso, renovacion mental.
-- Mezcla de tradition: shared, catholic, evangelical.
-- ==========================================================================
insert into public.scriptures (reference, body, tradition, themes) values
  ('Salmos 23:1', 'Jehova es mi pastor; nada me faltara.', 'shared', array['descanso','provision']),
  ('Salmos 46:1', 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', 'shared', array['fortaleza','esperanza']),
  ('Salmos 51:10', 'Crea en mi, oh Dios, un corazon limpio, y renueva un espiritu recto dentro de mi.', 'shared', array['identidad','renovacion']),
  ('Salmos 139:23-24', 'Examiname, oh Dios, y conoce mi corazon; pruebame y conoce mis pensamientos. Guiame en el camino eterno.', 'shared', array['identidad','introspeccion']),
  ('Salmos 34:18', 'Cercano esta Jehova a los quebrantados de corazon; y salva a los contritos de espiritu.', 'shared', array['consuelo','esperanza']),
  ('Filipenses 4:8', 'Todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable; en esto pensad.', 'shared', array['mente','renovacion']),
  ('Filipenses 4:13', 'Todo lo puedo en Cristo que me fortalece.', 'shared', array['fortaleza','identidad']),
  ('1 Corintios 10:13', 'No os ha sobrevenido tentacion que no sea humana; pero fiel es Dios, que dara tambien con la tentacion la salida.', 'shared', array['autocontrol','esperanza']),
  ('Romanos 12:2', 'No os conformeis a este siglo, sino transformaos por medio de la renovacion de vuestro entendimiento.', 'shared', array['renovacion','mente']),
  ('Romanos 8:1', 'Ahora, pues, ninguna condenacion hay para los que estan en Cristo Jesus.', 'shared', array['identidad','gracia']),
  ('Mateo 11:28', 'Venid a mi todos los que estais trabajados y cargados, y yo os hare descansar.', 'shared', array['descanso','consuelo']),
  ('2 Corintios 5:17', 'De modo que si alguno esta en Cristo, nueva criatura es; las cosas viejas pasaron; he aqui todas son hechas nuevas.', 'shared', array['identidad','renovacion']),
  ('Galatas 5:22-23', 'El fruto del Espiritu es: amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.', 'shared', array['autocontrol','virtud']),
  ('Proverbios 25:28', 'Como ciudad derribada y sin muro es el hombre cuyo espiritu no tiene rienda.', 'shared', array['autocontrol']),
  ('Santiago 1:12', 'Bienaventurado el varon que soporta la tentacion; porque cuando haya resistido la prueba, recibira la corona de vida.', 'shared', array['autocontrol','esperanza']),
  ('Isaias 41:10', 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.', 'shared', array['fortaleza','consuelo']),
  ('Jeremias 29:11', 'Yo se los pensamientos que tengo acerca de vosotros, pensamientos de paz, y no de mal, para daros el fin que esperais.', 'shared', array['esperanza']),
  ('Salmos 121:1-2', 'Alzare mis ojos a los montes; de donde vendra mi socorro? Mi socorro viene de Jehova.', 'shared', array['esperanza','fortaleza']),
  ('Lamentaciones 3:22-23', 'Por la misericordia de Jehova no hemos sido consumidos; nuevas son cada manana; grande es tu fidelidad.', 'shared', array['gracia','esperanza']),
  ('Salmos 32:8', 'Te hare entender, y te ensenare el camino en que debes andar; sobre ti fijare mis ojos.', 'shared', array['guia','identidad']),
  ('1 Pedro 5:7', 'Echando toda vuestra ansiedad sobre el, porque el tiene cuidado de vosotros.', 'shared', array['ansiedad','consuelo']),
  ('Hebreos 4:15-16', 'No tenemos un sumo sacerdote que no pueda compadecerse de nuestras debilidades. Acerquemonos confiadamente al trono de la gracia.', 'catholic', array['gracia','consuelo']),
  ('Mateo 6:34', 'No os afaneis por el dia de manana; basta a cada dia su propio mal.', 'shared', array['ansiedad','presente']),
  ('Salmos 37:5', 'Encomienda a Jehova tu camino, y confia en el; y el hara.', 'shared', array['confianza']),
  ('Eclesiastico 2:1', 'Hijo, si te llegas a servir al Senor, prepara tu alma para la prueba.', 'catholic', array['autocontrol','prueba']),
  ('Sabiduria 7:7', 'Por eso ore, y se me concedio la prudencia; suplique, y vino a mi el espiritu de la sabiduria.', 'catholic', array['sabiduria']),
  ('1 Juan 1:9', 'Si confesamos nuestros pecados, el es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.', 'evangelical', array['gracia','renovacion']),
  ('Efesios 2:8-9', 'Por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras.', 'evangelical', array['gracia','identidad']),
  ('Juan 8:36', 'Si el Hijo os libertare, sereis verdaderamente libres.', 'evangelical', array['libertad','identidad']),
  ('Romanos 6:14', 'El pecado no se ensenoreara de vosotros; pues no estais bajo la ley, sino bajo la gracia.', 'evangelical', array['libertad','gracia'])
on conflict do nothing;
