// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //--- Local variables
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams/');
    self.displayName = 'NBA Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
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
    self.History = ko.observable('');
    self.Players = ko.observable('');
    self.Seasons = ko.observable('');

    //--- Page Events
    self.activate = function (id, acronym) {
        console.log('CALL: getTeam...');
        var composedUri = self.baseUri() + id + '?acronym=' + acronym;
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
            self.History(data.History);
            self.Players(data.Players);
            self.Seasons(data.Seasons);
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        var ajaxRequest = $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        });
    
        ajaxRequest.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            self.error(errorThrown);
        });
    
        ajaxRequest.always(function () {
            hideLoading();  // This line is now outside the error callback
        });
    
        return ajaxRequest;
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
    };

    //--- start ....
    showLoading();
    var teamId = getUrlParameter('id');
    var teamAcronym = getUrlParameter('acronym');
    console.log(teamId);
    console.log(teamAcronym);
    if (teamId === undefined || teamAcronym === undefined) {
        self.activate(1, 'defaultAcronym');
    } else {
        self.activate(teamId, teamAcronym);
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