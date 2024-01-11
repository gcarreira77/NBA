// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Statistics/PlayersBySeason');
    self.displayName = 'NBA Season Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Regular = ko.observable([]);
    self.Playoff = ko.observableArray([]);
    self.Id = ko.observable('');
    self.Acronym = ko.observable('');
    self.Name = ko.observable('');
    self.ConferenceId = ko.observable('');
    self.ConferenceName = ko.observable('');
    self.DivisionId = ko.observable('');
    self.DivisionName= ko.observable('');
    self.StateId = ko.observable('');
    self.StateName = ko.observable('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');


    self.activate = function (teamId, seasonId, acronym) {
        console.log('CALL: getSeasonTeam...');
        var composedUri = self.baseUri() + '?teamId=' + teamId + '&seasonId=' + seasonId;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            if (data.length == 1) {
                self.Regular(data[0]);
                console.log(self.Regular());
            } else if (data.length == 2){
                if (data[0].SeasonType == 'Playoffs'){
                    self.Playoff(data[0]);
                    console.log(self.Playoff());
                    self.Regular(data[1]);
                    console.log(self.Regular());
                } else {
                    self.Regular(data[0]);
                    console.log(self.Regular());
                    self.Playoff(data[1]);
                    console.log(self.Playoff());
                }
            }
            var teamsComposedUri = 'http://192.168.160.58/NBA/api/Teams/' + teamId + '?acronym=' + acronym;
            self.teams(teamsComposedUri);

            hideLoading();

        });
        
        
    
    };
    self.teams = function (composedUri) {
        console.log('CALL: getSeasonTeam...');
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.Id(data.Id);
            self.Acronym(data.Acronym);
            self.Name(data.Name);
            self.ConferenceId(data.ConferenceId);
            self.DivisionId(data.DivisionId);
            self.DivisionName(data.DivisionName);
            self.StateId(data.StateId);
            self.StateName(data.StateName);
            self.City(data.City);
            self.Logo(data.Logo);
        });
    };
    

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return null; 
    }

    showLoading();

    var teamId = getUrlParameter('teamId');
    var seasonId = getUrlParameter('seasonId');
    var acronym= getUrlParameter('Acronym');


    if (teamId !== null && seasonId !== null && acronym !== null) {
        self.activate(teamId, seasonId, acronym);
    } else {
        self.activate(1610612737, 2020, 'ATL');
    }

    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});