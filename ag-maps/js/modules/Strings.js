var Strings = (function() {

  // strings repository
  var strings = {
    br: {
      appName: 'AgMaps Viewer',
      btnChangeFilters: 'Alterar filtros',
      openFileModalTitle: 'Configure o seu mapa',
      hintMoreOptions: 'Mais opções',
      btnCancel: 'Cancelar',
      btnLoadIntoMap: 'Carregar mapa',
      loadingDatabase: 'Carregando banco de dados',
      markerFieldTitle: 'Colorir marcadores por:',
      showOnly: 'Selecione itens para serem exibidos',
      filterBy: 'Filtrar por: ',
      noFieldSelected: '(Nenhum campo selecionado)',
      parsingError: 'Erro ao ler o banco de dados',
      fileTooBig: 'O arquivo selecionado é muito grande (maior que 5MB)',
      tooManyLines: 'O arquivo selecionado excede o máximo de 10.000 linhas',
      legendTitle: 'LEGENDA',
      blankField: '(Vazio)',
      navigate: 'Navegar ao local'
    },
    en: {
      appName: 'AgMaps Viewer',
      loadingDatabase: 'Loading database',
      markerFieldTitle: 'Color markers by:',
      openFileModalTitle: 'Load your map contents',
      hintMoreOptions: 'More options',
      btnCancel: 'Cancel',
      btnLoadIntoMap: 'Load map',
      btnChangeFilters: 'Change filters',
      showOnly: 'Select items to be shown',
      filterBy: 'Filter by: ',
      noFieldSelected: '(No field selected)',
      parsingError: 'Unable to read the selected file',
      fileTooBig: 'The selected file is too big (over 5MB)',
      tooManyLines: 'The selected file exceeds the maximum of 10,000 lines',
      legendTitle: 'LEGEND',
      blankField: '(Blank)',
      navigate: 'Navigate to location'
    }
  };

  // loading language preference, default: en (english)
  var mHash = window.location.hash.substr(1).toLowerCase();
  var mLanguage = (strings[mHash] ? mHash : 'en');

  return strings[mLanguage];

})();
