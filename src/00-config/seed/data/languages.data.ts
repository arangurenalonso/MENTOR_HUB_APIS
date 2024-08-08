const commonLanguages = [
  {
    id: '4bdc26d3-3dcf-4dec-a17b-37165c1f83a9',
    language_name: 'Afar',
    iso_639_1: 'aa',
  },
  {
    id: '76a7bd75-5fbb-4a86-93dc-5155fc2e0065',
    language_name: 'Abkhazian',
    iso_639_1: 'ab',
  },
  {
    id: '70ebe696-11d9-4552-8e90-a0d72e9d7991',
    language_name: 'Afrikaans',
    iso_639_1: 'af',
  },
  {
    id: '197e2fc1-1141-4746-80a0-4a22ed3495b3',
    language_name: 'Akan',
    iso_639_1: 'ak',
  },
  {
    id: 'e4b683a3-90d6-47ab-8d29-eb473215fefd',
    language_name: 'Amharic',
    iso_639_1: 'am',
  },
  {
    id: '6ef6a58a-81f4-4b85-b33a-805c366734c7',
    language_name: 'Arabic',
    iso_639_1: 'ar',
  },
  {
    id: '5d772c98-683d-46df-9a40-e6553d7d5660',
    language_name: 'Aragonese',
    iso_639_1: 'an',
  },
  {
    id: '0bc1714b-88ce-4cdc-a7ef-e99d9ff1e206',
    language_name: 'Assamese',
    iso_639_1: 'as',
  },
  {
    id: '251a249a-84ed-45e7-bf0e-0ceb66272bc6',
    language_name: 'Avaric',
    iso_639_1: 'av',
  },
  {
    id: 'b7ddc3c4-6b28-4c51-a287-eb195f149f29',
    language_name: 'Avestan',
    iso_639_1: 'ae',
  },
  {
    id: '40c0299c-fc09-4466-a53e-f48ea4c40bc4',
    language_name: 'Aymara',
    iso_639_1: 'ay',
  },
  {
    id: 'a9aa299f-4757-4296-b46f-163dc34c420a',
    language_name: 'Azerbaijani',
    iso_639_1: 'az',
  },
  {
    id: '6ccd112f-22f3-45b9-be20-932b9367dc57',
    language_name: 'Bashkir',
    iso_639_1: 'ba',
  },
  {
    id: '1b5eb64d-0cd6-4115-9cc6-0241d2b693a5',
    language_name: 'Bambara',
    iso_639_1: 'bm',
  },
  {
    id: '06d12598-46bb-423a-b245-c47cd0386ce6',
    language_name: 'Belarusian',
    iso_639_1: 'be',
  },
  {
    id: '9e871222-b2c8-417e-86af-62169fc92832',
    language_name: 'Bengali',
    iso_639_1: 'bn',
  },
  {
    id: 'b15afada-6f00-4ec3-a0c5-5dd7ecee57da',
    language_name: 'Bislama',
    iso_639_1: 'bi',
  },
  {
    id: 'bf9148bf-f2a4-4d76-b232-b2986384db2d',
    language_name: 'Tibetan',
    iso_639_1: 'bo',
  },
  {
    id: '5aad27b1-1d32-49f2-9186-7991b8808d33',
    language_name: 'Bosnian',
    iso_639_1: 'bs',
  },
  {
    id: 'cef47708-6e72-48bc-a82c-769587cc02b4',
    language_name: 'Breton',
    iso_639_1: 'br',
  },
  {
    id: '65e2ab62-03fd-48c5-8bd2-7d1406e749af',
    language_name: 'Bulgarian',
    iso_639_1: 'bg',
  },
  {
    id: 'f8a92151-2665-4fe4-958b-6f3a9867380d',
    language_name: 'Catalan',
    iso_639_1: 'ca',
  },
  {
    id: 'fe633891-b5cb-46f5-b0c4-3e2daa12ca1c',
    language_name: 'Czech',
    iso_639_1: 'cs',
  },
  {
    id: '10da2f0f-757a-4f2a-8377-1df686662eff',
    language_name: 'Chamorro',
    iso_639_1: 'ch',
  },
  {
    id: '01f65ce0-2ba5-4c1b-9474-39bd962f3277',
    language_name: 'Chechen',
    iso_639_1: 'ce',
  },
  {
    id: '98d43577-6082-44e7-8201-85f05eb9004e',
    language_name: 'Church Slavic',
    iso_639_1: 'cu',
  },
  {
    id: '7966d9b4-37d6-4525-ac3d-b2badb66836a',
    language_name: 'Chuvash',
    iso_639_1: 'cv',
  },
  {
    id: 'e7ccf7ba-2926-400b-9eb2-67fa541be341',
    language_name: 'Cornish',
    iso_639_1: 'kw',
  },
  {
    id: 'a9a34c88-4805-4f32-98d9-15845ba93643',
    language_name: 'Corsican',
    iso_639_1: 'co',
  },
  {
    id: '667d2290-9ad5-468e-b7d0-298df5f4e848',
    language_name: 'Cree',
    iso_639_1: 'cr',
  },
  {
    id: '72b6aed9-6e31-4b67-ba23-6ae6259fdb4a',
    language_name: 'Welsh',
    iso_639_1: 'cy',
  },
  {
    id: 'fac40fdd-72a9-4e2d-8afe-4cc7aaad6763',
    language_name: 'Danish',
    iso_639_1: 'da',
  },
  {
    id: '7d0284cb-0ee6-43d5-b54d-862d90a36640',
    language_name: 'German',
    iso_639_1: 'de',
  },
  {
    id: '72d51ed8-f1ac-4a16-b60b-9186078d822b',
    language_name: 'Dhivehi',
    iso_639_1: 'dv',
  },
  {
    id: '03471c0a-60bf-4786-8a6b-117efd64b98b',
    language_name: 'Dzongkha',
    iso_639_1: 'dz',
  },
  {
    id: 'c6e86fb6-7735-46bc-a106-c5d68d607107',
    language_name: 'Modern Greek (1453-)',
    iso_639_1: 'el',
  },
  {
    id: 'c5626bb7-a633-4740-a4a0-87eee680adcc',
    language_name: 'English',
    iso_639_1: 'en',
  },
  {
    id: 'f8a12ae2-286a-4c2d-b1e6-c5977122c257',
    language_name: 'Esperanto',
    iso_639_1: 'eo',
  },
  {
    id: 'd1fd33b7-8d36-46b5-bb96-f72cc05b4672',
    language_name: 'Estonian',
    iso_639_1: 'et',
  },
  {
    id: 'fceba23b-631a-4fd0-9c86-20f4d6fcb95d',
    language_name: 'Basque',
    iso_639_1: 'eu',
  },
  {
    id: '019da924-92e4-4cf5-b8ee-72b9d8c75810',
    language_name: 'Ewe',
    iso_639_1: 'ee',
  },
  {
    id: 'c8e05f42-a935-4705-87f2-3c57e35ea5e1',
    language_name: 'Faroese',
    iso_639_1: 'fo',
  },
  {
    id: '99f7b50b-986a-42c7-9416-fdef92c10cab',
    language_name: 'Persian',
    iso_639_1: 'fa',
  },
  {
    id: '90c8c06c-f074-4761-8266-6f2ce7b34bc0',
    language_name: 'Fijian',
    iso_639_1: 'fj',
  },
  {
    id: 'eaa8f1e3-bc9b-47e9-a818-17769e4e1a0f',
    language_name: 'Finnish',
    iso_639_1: 'fi',
  },
  {
    id: '24e42b8a-77fb-43f3-bbd2-478ed33f078c',
    language_name: 'French',
    iso_639_1: 'fr',
  },
  {
    id: '829bca31-fbfa-465d-833d-dd4b2fc8720e',
    language_name: 'Western Frisian',
    iso_639_1: 'fy',
  },
  {
    id: '712fd0c6-086b-4379-a64f-483d51b95a89',
    language_name: 'Fulah',
    iso_639_1: 'ff',
  },
  {
    id: '1f8bbf3f-af48-4478-908d-d2ba0a403410',
    language_name: 'Scottish Gaelic',
    iso_639_1: 'gd',
  },
  {
    id: '910370e9-c2af-41b4-a5b7-1485f5976951',
    language_name: 'Irish',
    iso_639_1: 'ga',
  },
  {
    id: '4f38dc0a-acbd-480b-8b70-e58cacc4f814',
    language_name: 'Galician',
    iso_639_1: 'gl',
  },
  {
    id: '15f87024-9c41-472c-9c4e-f22e83e20947',
    language_name: 'Manx',
    iso_639_1: 'gv',
  },
  {
    id: 'cd7468ce-db68-4595-93be-4b20229dd884',
    language_name: 'Guarani',
    iso_639_1: 'gn',
  },
  {
    id: 'eb53e2a1-9eed-45a4-9b32-97667deff85f',
    language_name: 'Gujarati',
    iso_639_1: 'gu',
  },
  {
    id: '46cfbf16-a5d3-4c77-9148-c767def91374',
    language_name: 'Haitian',
    iso_639_1: 'ht',
  },
  {
    id: '30716839-c56e-415a-ae79-f5049dce0923',
    language_name: 'Hausa',
    iso_639_1: 'ha',
  },
  {
    id: 'd3e5cca8-f971-4adc-9661-48df027f4bb2',
    language_name: 'Serbo-Croatian',
    iso_639_1: 'sh',
  },
  {
    id: 'b77ced20-3ef0-4e2e-aacd-8c0272dc3482',
    language_name: 'Hebrew',
    iso_639_1: 'he',
  },
  {
    id: 'cbbf8969-4d8e-400c-94c1-14ec01f496c0',
    language_name: 'Herero',
    iso_639_1: 'hz',
  },
  {
    id: 'ca2d8dbb-cafc-4b05-8090-c0b4246aebc0',
    language_name: 'Hindi',
    iso_639_1: 'hi',
  },
  {
    id: '5cc96b28-504c-46df-a35c-f8a64e55b221',
    language_name: 'Hiri Motu',
    iso_639_1: 'ho',
  },
  {
    id: '986bbd26-0c26-4c0b-b6fe-b6fd9c16c069',
    language_name: 'Croatian',
    iso_639_1: 'hr',
  },
  {
    id: '51c84717-b77f-4d84-9f9d-95e5c2395b5a',
    language_name: 'Hungarian',
    iso_639_1: 'hu',
  },
  {
    id: 'f7079f8b-d1d8-4797-9b54-0cdd80e416a4',
    language_name: 'Armenian',
    iso_639_1: 'hy',
  },
  {
    id: '5137a7e9-0d3f-44f2-ac4e-15efb0f55dbd',
    language_name: 'Igbo',
    iso_639_1: 'ig',
  },
  {
    id: '17987e19-9308-464c-9a10-44db2e785605',
    language_name: 'Ido',
    iso_639_1: 'io',
  },
  {
    id: '3e4549b8-ff53-4648-9fe0-036056df7a69',
    language_name: 'Sichuan Yi',
    iso_639_1: 'ii',
  },
  {
    id: '9e984cb2-252a-4caa-8dc2-29478e4e473c',
    language_name: 'Inuktitut',
    iso_639_1: 'iu',
  },
  {
    id: '5d839a38-8423-4913-ac64-aa3c09396b1e',
    language_name: 'Interlingue',
    iso_639_1: 'ie',
  },
  {
    id: '82b55e3a-0fd2-4c70-8b89-963c498460dc',
    language_name: 'Interlingua (International Auxiliary Language Association)',
    iso_639_1: 'ia',
  },
  {
    id: '0de56689-c796-4838-a3d8-ad605f233442',
    language_name: 'Indonesian',
    iso_639_1: 'id',
  },
  {
    id: 'fa02d1b0-b00c-492c-bf5b-1766d45fa9d8',
    language_name: 'Inupiaq',
    iso_639_1: 'ik',
  },
  {
    id: 'd6338340-ae28-41b8-9efa-71730d58d1ed',
    language_name: 'Icelandic',
    iso_639_1: 'is',
  },
  {
    id: '3867dac7-5f72-42e8-83e6-a135bdcff007',
    language_name: 'Italian',
    iso_639_1: 'it',
  },
  {
    id: 'f71a4058-40c6-4585-8e71-883c5019be23',
    language_name: 'Javanese',
    iso_639_1: 'jv',
  },
  {
    id: '73b4343f-21de-442d-8ac7-420c15f9045b',
    language_name: 'Japanese',
    iso_639_1: 'ja',
  },
  {
    id: '2d2b71ba-1f55-4290-b0bd-6d4f60406241',
    language_name: 'Kalaallisut',
    iso_639_1: 'kl',
  },
  {
    id: 'bfdf749b-dd03-4330-86f4-e8550beffebd',
    language_name: 'Kannada',
    iso_639_1: 'kn',
  },
  {
    id: '72a1b488-63e5-4b7b-8645-f6f065b29cb9',
    language_name: 'Kashmiri',
    iso_639_1: 'ks',
  },
  {
    id: 'a4192d6a-137d-4376-bdca-73a7a5b590dc',
    language_name: 'Georgian',
    iso_639_1: 'ka',
  },
  {
    id: '7ff2b2ae-c9e0-4745-ba53-0546b98eb9d9',
    language_name: 'Kanuri',
    iso_639_1: 'kr',
  },
  {
    id: 'fbf737c9-ef91-48ff-a8a3-c02fd2096d5f',
    language_name: 'Kazakh',
    iso_639_1: 'kk',
  },
  {
    id: '181475e3-2a1e-448d-8a69-186b933d995c',
    language_name: 'Khmer',
    iso_639_1: 'km',
  },
  {
    id: '70e13f2c-326a-462a-93ff-6acfd61525b1',
    language_name: 'Kikuyu',
    iso_639_1: 'ki',
  },
  {
    id: 'f54135c1-e71e-4fd5-8346-68a79020346c',
    language_name: 'Kinyarwanda',
    iso_639_1: 'rw',
  },
  {
    id: '32dfdd36-bdeb-45e5-ad25-8da080ed3a1f',
    language_name: 'Kirghiz',
    iso_639_1: 'ky',
  },
  {
    id: 'cb562aee-96c7-495c-80af-25171a583a18',
    language_name: 'Komi',
    iso_639_1: 'kv',
  },
  {
    id: '7f3ac164-e304-4023-844a-2401ad7b5906',
    language_name: 'Kongo',
    iso_639_1: 'kg',
  },
  {
    id: 'cbaebb4d-5054-4f30-a3ef-ee5d2a31b210',
    language_name: 'Korean',
    iso_639_1: 'ko',
  },
  {
    id: 'c439e1cc-7616-4bdd-bd36-f69fc10b3aa0',
    language_name: 'Kuanyama',
    iso_639_1: 'kj',
  },
  {
    id: 'e63c5423-bfd2-4ba9-a66b-7bb395ac253c',
    language_name: 'Kurdish',
    iso_639_1: 'ku',
  },
  {
    id: '26ab3c08-a426-4946-ab7f-17e5897be930',
    language_name: 'Lao',
    iso_639_1: 'lo',
  },
  {
    id: '01a50545-a9f6-4208-86b0-0acd60343b90',
    language_name: 'Latin',
    iso_639_1: 'la',
  },
  {
    id: '09486ec9-e10b-43db-8d09-cd1335d031d2',
    language_name: 'Latvian',
    iso_639_1: 'lv',
  },
  {
    id: 'e7793a6c-1763-4181-bc8b-5a25e06e2fb6',
    language_name: 'Limburgan',
    iso_639_1: 'li',
  },
  {
    id: '64e9d234-03a8-4357-8e71-5ff9c6ee6403',
    language_name: 'Lingala',
    iso_639_1: 'ln',
  },
  {
    id: '481efbd0-8d2e-49d4-844d-5333eceec5af',
    language_name: 'Lithuanian',
    iso_639_1: 'lt',
  },
  {
    id: '33d29ea0-f1da-4907-a69d-001f4048557d',
    language_name: 'Luxembourgish',
    iso_639_1: 'lb',
  },
  {
    id: '82bf5f41-3034-4b99-a9d6-086bd802561e',
    language_name: 'Luba-Katanga',
    iso_639_1: 'lu',
  },
  {
    id: '5d3469f4-3b73-4d15-bd15-61196def0938',
    language_name: 'Ganda',
    iso_639_1: 'lg',
  },
  {
    id: '5be35066-bc4c-4d15-998a-93196d5ac4b7',
    language_name: 'Marshallese',
    iso_639_1: 'mh',
  },
  {
    id: '942aaceb-0a7b-4de0-9350-d901f59d4eea',
    language_name: 'Malayalam',
    iso_639_1: 'ml',
  },
  {
    id: '17637982-0d6c-47b2-bb23-3b2a0dc85888',
    language_name: 'Marathi',
    iso_639_1: 'mr',
  },
  {
    id: '03e46df5-8a11-41a0-9fb1-672d2c254e17',
    language_name: 'Macedonian',
    iso_639_1: 'mk',
  },
  {
    id: '722dd698-28a5-4f29-8d24-c7a73ea192be',
    language_name: 'Malagasy',
    iso_639_1: 'mg',
  },
  {
    id: 'a737fbad-2ce8-4141-a610-3eb7246d1199',
    language_name: 'Maltese',
    iso_639_1: 'mt',
  },
  {
    id: '3a94b5a5-b3d9-4697-a1f3-f83011812e68',
    language_name: 'Mongolian',
    iso_639_1: 'mn',
  },
  {
    id: '422f82f8-6cd4-4d68-9eab-4ac29f817294',
    language_name: 'Maori',
    iso_639_1: 'mi',
  },
  {
    id: '29147185-27de-490e-8f80-1fabf04aa749',
    language_name: 'Malay (macrolanguage)',
    iso_639_1: 'ms',
  },
  {
    id: 'e0d0b383-aab7-4af6-9e21-76e0e13005b3',
    language_name: 'Burmese',
    iso_639_1: 'my',
  },
  {
    id: 'dfec0f8f-2bce-4eac-bbd3-5f63bd852014',
    language_name: 'Nauru',
    iso_639_1: 'na',
  },
  {
    id: 'a3dabbea-89c9-413c-aba6-ac9dca3a8782',
    language_name: 'Navajo',
    iso_639_1: 'nv',
  },
  {
    id: 'dc2081ad-afdb-4d3d-9729-c509ba3fc8a5',
    language_name: 'South Ndebele',
    iso_639_1: 'nr',
  },
  {
    id: '37982423-9850-4e5d-bf2b-279e7ee1c689',
    language_name: 'North Ndebele',
    iso_639_1: 'nd',
  },
  {
    id: 'ef604311-8d35-4140-8a10-e78fe58e0aa2',
    language_name: 'Ndonga',
    iso_639_1: 'ng',
  },
  {
    id: 'f0a45ab5-9555-4ea7-ae52-9b34d161f33f',
    language_name: 'Nepali (macrolanguage)',
    iso_639_1: 'ne',
  },
  {
    id: '2d31fbdf-596a-46ec-aecb-91b08db8b9bf',
    language_name: 'Dutch',
    iso_639_1: 'nl',
  },
  {
    id: '68cda11a-c96e-422b-9e93-58b9466f54c3',
    language_name: 'Norwegian Nynorsk',
    iso_639_1: 'nn',
  },
  {
    id: '85d813cf-0907-40b5-be3b-4a7930e286c9',
    language_name: 'Norwegian Bokm\u00e5l',
    iso_639_1: 'nb',
  },
  {
    id: '3309f010-3f26-4f74-a14d-48f5bd260e90',
    language_name: 'Norwegian',
    iso_639_1: 'no',
  },
  {
    id: 'ae595505-f8e0-4b78-b357-2b9d07067948',
    language_name: 'Nyanja',
    iso_639_1: 'ny',
  },
  {
    id: 'b44c1be8-1f64-4f09-a375-729b468feda2',
    language_name: 'Occitan (post 1500)',
    iso_639_1: 'oc',
  },
  {
    id: '8df846d5-05da-4e07-b3d6-d9b401634d72',
    language_name: 'Ojibwa',
    iso_639_1: 'oj',
  },
  {
    id: '815203aa-e19b-410f-bb20-0af261c73ce8',
    language_name: 'Oriya (macrolanguage)',
    iso_639_1: 'or',
  },
  {
    id: '509a89c8-cdfe-4795-aed6-ac4c3cd43926',
    language_name: 'Oromo',
    iso_639_1: 'om',
  },
  {
    id: '53fd0869-c19e-48ce-8550-981472cffd2d',
    language_name: 'Ossetian',
    iso_639_1: 'os',
  },
  {
    id: 'b2b9b475-1d42-4e65-b022-69cb42d77401',
    language_name: 'Panjabi',
    iso_639_1: 'pa',
  },
  {
    id: 'c9295eca-36a8-4705-a26d-20bd2f0ae20f',
    language_name: 'Pali',
    iso_639_1: 'pi',
  },
  {
    id: 'd2b976fa-4cc2-4c33-a5d7-73f6336487c5',
    language_name: 'Polish',
    iso_639_1: 'pl',
  },
  {
    id: 'f0cd9836-9975-4c2d-9f69-1a3899da8890',
    language_name: 'Portuguese',
    iso_639_1: 'pt',
  },
  {
    id: '317fd764-f6f2-4760-ba54-8a8cc7b9e114',
    language_name: 'Pushto',
    iso_639_1: 'ps',
  },
  {
    id: 'f822abc0-691c-459a-bb4d-922a0516fe96',
    language_name: 'Quechua',
    iso_639_1: 'qu',
  },
  {
    id: '48b45da6-d375-4942-bac7-64caec43baf0',
    language_name: 'Romansh',
    iso_639_1: 'rm',
  },
  {
    id: '8ee6b067-5eb6-44e4-80cc-3008c13738a3',
    language_name: 'Romanian',
    iso_639_1: 'ro',
  },
  {
    id: '1304295a-88f6-4853-a607-4d96e425100f',
    language_name: 'Rundi',
    iso_639_1: 'rn',
  },
  {
    id: '96dd3af5-f95b-4ddf-896a-7fddb5683820',
    language_name: 'Russian',
    iso_639_1: 'ru',
  },
  {
    id: '84960952-72de-4e4b-a8a3-b6924bb525f5',
    language_name: 'Sango',
    iso_639_1: 'sg',
  },
  {
    id: '07387c89-d704-4535-8da0-55f1b3899f03',
    language_name: 'Sanskrit',
    iso_639_1: 'sa',
  },
  {
    id: '0d52affc-f9e8-44fe-b8c5-60ba29a5f8ab',
    language_name: 'Sinhala',
    iso_639_1: 'si',
  },
  {
    id: '5557b258-2022-400a-85a8-44633cc99ec0',
    language_name: 'Slovak',
    iso_639_1: 'sk',
  },
  {
    id: 'd89172e9-8109-449d-97b2-f3745b89eeb8',
    language_name: 'Slovenian',
    iso_639_1: 'sl',
  },
  {
    id: 'ba81e307-d5b9-449a-a31a-3313c50c5746',
    language_name: 'Northern Sami',
    iso_639_1: 'se',
  },
  {
    id: '7cda168a-1a6c-496c-8691-90f990123f16',
    language_name: 'Samoan',
    iso_639_1: 'sm',
  },
  {
    id: '7645c991-2c8d-4fbc-b909-80b5c1bd1e6f',
    language_name: 'Shona',
    iso_639_1: 'sn',
  },
  {
    id: '1174811d-0dbf-4bb8-b388-6ed80741f47a',
    language_name: 'Sindhi',
    iso_639_1: 'sd',
  },
  {
    id: '64b2b43a-eaab-4161-adf5-4b6b17de9e98',
    language_name: 'Somali',
    iso_639_1: 'so',
  },
  {
    id: '4a1f0601-aecf-4d0d-ade9-967f35e6beef',
    language_name: 'Southern Sotho',
    iso_639_1: 'st',
  },
  {
    id: '3bd3196e-f9c6-4fb7-a210-d8bdcad250ba',
    language_name: 'Spanish',
    iso_639_1: 'es',
  },
  {
    id: '71915f36-95d5-4d0f-ac3f-42909742b645',
    language_name: 'Albanian',
    iso_639_1: 'sq',
  },
  {
    id: 'd3f2acf1-86f3-4d2e-81d9-6254ffc5e4ce',
    language_name: 'Sardinian',
    iso_639_1: 'sc',
  },
  {
    id: '26e5d915-18f6-4ce6-94c2-55ef41d8307d',
    language_name: 'Serbian',
    iso_639_1: 'sr',
  },
  {
    id: '7feec74f-f036-4639-83db-e57a781c2e30',
    language_name: 'Swati',
    iso_639_1: 'ss',
  },
  {
    id: '2f0072ec-c1b4-4f2c-b885-4df55869bb1b',
    language_name: 'Sundanese',
    iso_639_1: 'su',
  },
  {
    id: '16f15bb0-18ac-4f48-8141-e95e0b89a4e0',
    language_name: 'Swahili (macrolanguage)',
    iso_639_1: 'sw',
  },
  {
    id: 'c6934969-a4e6-49dc-b9d7-15de9f066fee',
    language_name: 'Swedish',
    iso_639_1: 'sv',
  },
  {
    id: '51ba9e8f-a631-4247-b6d7-8ad4bfdd9900',
    language_name: 'Tahitian',
    iso_639_1: 'ty',
  },
  {
    id: '3de2161c-c960-42a1-8ccb-2682049c2d8d',
    language_name: 'Tamil',
    iso_639_1: 'ta',
  },
  {
    id: '5fbbf78a-dc5e-45f3-8674-dae0958501e4',
    language_name: 'Tatar',
    iso_639_1: 'tt',
  },
  {
    id: '3280853b-1af4-4787-a93d-5cb9ba5a3350',
    language_name: 'Telugu',
    iso_639_1: 'te',
  },
  {
    id: 'cfe479c7-3642-4e5d-8886-7a04398ad08b',
    language_name: 'Tajik',
    iso_639_1: 'tg',
  },
  {
    id: 'fa86081d-e23a-4c94-a860-0b7e42cdbb1f',
    language_name: 'Tagalog',
    iso_639_1: 'tl',
  },
  {
    id: 'e7c2969a-c86c-4c01-b534-94e4aae694fd',
    language_name: 'Thai',
    iso_639_1: 'th',
  },
  {
    id: '003486ae-f2ee-425a-94dd-7c3babc48101',
    language_name: 'Tigrinya',
    iso_639_1: 'ti',
  },
  {
    id: '74321ef9-c883-452f-8ce5-1a67a6dde1bb',
    language_name: 'Tonga (Tonga Islands)',
    iso_639_1: 'to',
  },
  {
    id: 'e80494fc-f2d6-44be-a3fc-3407f2afd97e',
    language_name: 'Tswana',
    iso_639_1: 'tn',
  },
  {
    id: '1fac2b0a-279f-402e-adfe-36df154d0aba',
    language_name: 'Tsonga',
    iso_639_1: 'ts',
  },
  {
    id: '8e6af04a-18c1-4a12-a0b1-16a2d0df501a',
    language_name: 'Turkmen',
    iso_639_1: 'tk',
  },
  {
    id: '373c29ae-5a06-440a-aa58-0846a7b41bbe',
    language_name: 'Turkish',
    iso_639_1: 'tr',
  },
  {
    id: '8475cf8c-2824-4685-be59-b4b1de241578',
    language_name: 'Twi',
    iso_639_1: 'tw',
  },
  {
    id: 'af7e5b94-2085-45d4-b4b8-de6c62d7a21f',
    language_name: 'Uighur',
    iso_639_1: 'ug',
  },
  {
    id: '03de3cbe-161f-41ec-8e1a-912b89bba274',
    language_name: 'Ukrainian',
    iso_639_1: 'uk',
  },
  {
    id: '43abfd2c-4606-4dd3-b048-aa8457b6d8c0',
    language_name: 'Urdu',
    iso_639_1: 'ur',
  },
  {
    id: '813f8ce8-ad72-42ac-a7f7-54ba66b18629',
    language_name: 'Uzbek',
    iso_639_1: 'uz',
  },
  {
    id: '26f408c5-2c3e-4d0e-a625-7d3a9e248580',
    language_name: 'Venda',
    iso_639_1: 've',
  },
  {
    id: '9dbab891-e9b5-4553-9692-18d672bcf633',
    language_name: 'Vietnamese',
    iso_639_1: 'vi',
  },
  {
    id: '975a68ee-615b-472a-ba6c-2a15caed2e2d',
    language_name: 'Volap\u00fck',
    iso_639_1: 'vo',
  },
  {
    id: '7dc3fe4d-7478-4b9c-9ef4-578e80a5d9f9',
    language_name: 'Walloon',
    iso_639_1: 'wa',
  },
  {
    id: 'ac6ec609-3988-4f9a-8694-632179107b86',
    language_name: 'Wolof',
    iso_639_1: 'wo',
  },
  {
    id: '39d0f40f-e8b8-47a6-910c-a83af194f005',
    language_name: 'Xhosa',
    iso_639_1: 'xh',
  },
  {
    id: '6e7027e3-751a-4745-845e-6c84bf4f5a73',
    language_name: 'Yiddish',
    iso_639_1: 'yi',
  },
  {
    id: 'e71d5ec0-f12d-4f2b-acbd-e19968e8c552',
    language_name: 'Yoruba',
    iso_639_1: 'yo',
  },
  {
    id: '950a12e7-1d1f-47d2-99b8-c8df4f9fe512',
    language_name: 'Zhuang',
    iso_639_1: 'za',
  },
  {
    id: 'f9467e34-58f4-4ef9-a965-d503e327a60e',
    language_name: 'Chinese',
    iso_639_1: 'zh',
  },
  {
    id: '9a8058bd-1a23-4278-a8f1-5c601dbef7a9',
    language_name: 'Zulu',
    iso_639_1: 'zu',
  },
];
