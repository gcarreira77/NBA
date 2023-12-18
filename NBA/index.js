$(document).ready(function () {
    // ... (seu código existente)

    // Ativar o autocompletar no campo de pesquisa
    $("#searchInput").autocomplete({
        source: function (request, response) {
            // Chamar a API de autocompletar com base na entrada do usuário
            $.ajax({
                url: "http://192.168.160.58/NBA/api/Search",
                method: "GET",
                dataType: "json",
                data: { q: request.term },
                success: function (data) {
                    // Mapear os resultados para o formato esperado pelo autocomplete
                    var autocompleteData = $.map(data, function (item) {
                        return {
                            label: item.Name, // Nome para exibição
                            value: item.Id // Valor associado ao item selecionado
                        };
                    });
                    response(autocompleteData);
                },
                error: function (error) {
                    console.error("Erro ao obter sugestões de pesquisa:", error);
                }
            });
        },
        minLength: 3, // Número mínimo de caracteres antes de acionar a busca
        select: function (event, ui) {
            // Lógica a ser executada quando um item é selecionado
            console.log("Item selecionado:", ui.item.label, ui.item.value);
            // Redirecionar para a página adequada ou realizar outra ação
        }
    });
});