/**
 * Utilitário de fonética facilitada / intuitiva em português brasileiro
 * Converte frases em inglês na forma mais fácil de ler e pronunciar
 * Ex: "the someone waiting for me" -> "de sô-mên vei-tin for maí"
 */

const PHONETIC_DICT = {
  // Artigos e pronomes
  'the': 'de',
  'a': 'ê',
  'an': 'én',
  'i': 'ai',
  'you': 'iú',
  'he': 'rrí',
  'she': 'xí',
  'it': 'it',
  'we': 'uí',
  'they': 'dêi',
  'me': 'mi / maí',
  'him': 'rrim',
  'her': 'rrer',
  'us': 'ãs',
  'them': 'dêm',
  'my': 'mái',
  'your': 'iór',
  'his': 'rris',
  'our': 'áur',
  'their': 'dér',
  'this': 'dis',
  'that': 'dét',
  'these': 'diz',
  'those': 'douz',
  'someone': 'sô-mên',
  'anyone': 'éni-uãn',
  'everyone': 'évri-uãn',
  'no one': 'nôu uãn',
  'something': 'sâm-tin',
  'anything': 'éni-tin',
  'nothing': 'nâ-tin',

  // Saudações e cortesias
  'hello': 'ré-lou',
  'hi': 'rrai',
  'hey': 'rrêi',
  'good': 'gud',
  'morning': 'mór-nin',
  'afternoon': 'éf-ter-nun',
  'evening': 'ív-nin',
  'night': 'náit',
  'please': 'pliis',
  'thanks': 'ténks',
  'thank': 'ténk',
  'welcome': 'uél-kãm',
  'sorry': 'só-ri',
  'excuse': 'eks-kiúz',
  'pardon': 'pár-don',
  'bye': 'bái',
  'goodbye': 'gud-bái',
  'see': 'síi',
  'later': 'lêi-ter',
  'soon': 'suun',

  // Verbos comuns
  'am': 'ém',
  'is': 'iz',
  'are': 'ár',
  'was': 'uóz',
  'were': 'uêr',
  'be': 'bi',
  'been': 'bin',
  'have': 'rrév',
  'has': 'rréz',
  'had': 'rréd',
  'do': 'du',
  'does': 'dâz',
  'did': 'did',
  'go': 'gou',
  'goes': 'gouz',
  'went': 'uênt',
  'gone': 'gón',
  'going': 'gôu-in',
  'gonna': 'góna',
  'want': 'uónt',
  'wanna': 'uána',
  'like': 'láik',
  'would': 'uúd',
  'could': 'cúd',
  'should': 'xúd',
  'can': 'kén',
  'get': 'gét',
  'wait': 'uêit',
  'waiting': 'vei-tin / uêi-tin',
  'say': 'sêi',
  'tell': 'tél',
  'speak': 'spík',
  'talk': 'tók',
  'meet': 'mít',
  'know': 'nôu',
  'think': 'tink',
  'take': 'têik',
  'make': 'mêik',
  'come': 'kâm',
  'help': 'rrélp',
  'need': 'níid',
  'order': 'ór-der',
  'pay': 'pêi',

  // Palavras interrogativas
  'what': 'uót',
  "what's": 'uóts',
  'how': 'rráu',
  'who': 'rru',
  'where': 'uêr',
  'when': 'uên',
  'why': 'uái',
  'which': 'uítch',

  // Preposições e conectivos
  'for': 'for',
  'to': 'tu',
  'in': 'in',
  'on': 'on',
  'at': 'ét',
  'with': 'uiz',
  'about': 'a-báut',
  'and': 'énd',
  'or': 'or',
  'but': 'bât',
  'so': 'sôu',
  'of': 'ov',
  'from': 'from',

  // Palavras de restaurante e dia a dia
  'coffee': 'có-fi',
  'tea': 'tíi',
  'water': 'uó-ter',
  'milk': 'mílk',
  'sugar': 'xú-gar',
  'cup': 'kâp',
  'table': 'têi-bol',
  'name': 'nêim',
  'friend': 'frênd',
  'fine': 'fáin',
  'tired': 'tái-erd',
  'ready': 'ré-di',
  'here': 'rrí-er',
  'there': 'dêr',
  'dollars': 'dó-lars',
  'cash': 'késh',
  'card': 'kárd',
  'today': 'tu-dêi'
};

/**
 * Converte frase em inglês para guia de pronúncia facilitada
 * @param {string} englishPhrase Frase em inglês
 * @returns {string} Pronúncia amigável e abrasileirada
 */
export function getIntuitivePronunciation(englishPhrase) {
  if (!englishPhrase) return '';

  // Limpa pontuações para tokenização mas mantém referências
  const words = englishPhrase.trim().split(/\s+/);

  const phoneticWords = words.map(w => {
    // Remove pontuação das bordas
    const clean = w.toLowerCase().replace(/^[.,?!:;'"()]+|[.,?!:;'"()]+$/g, '');
    
    if (PHONETIC_DICT[clean]) {
      return PHONETIC_DICT[clean];
    }

    // Regras heurísticas simples de pronúncia para palavras desconhecidas
    let approx = clean
      .replace(/th/g, 'd')
      .replace(/ph/g, 'f')
      .replace(/tion/g, 'xãn')
      .replace(/sion/g, 'jãn')
      .replace(/ing$/g, 'in')
      .replace(/ee/g, 'ii')
      .replace(/ea/g, 'ii')
      .replace(/oo/g, 'uu')
      .replace(/igh/g, 'ai')
      .replace(/ight/g, 'áit')
      .replace(/ay/g, 'êi')
      .replace(/ey/g, 'êi')
      .replace(/ow/g, 'ou')
      .replace(/sh/g, 'x')
      .replace(/ch/g, 'tch')
      .replace(/^h/g, 'rr');

    return approx;
  });

  return phoneticWords.join(' ');
}
