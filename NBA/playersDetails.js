// Player ViewModel
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Players/');
    self.displayName = 'NBA Players Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Birthdate = ko.observable('');
    self.CountryId = ko.observable('');
    self.CountryName = ko.observable('');
    self.DraftYear = ko.observable('');
    self.PositionId = ko.observable('');
    self.PositionName = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.School = ko.observable('');
    self.Photo = ko.observable('');
    self.Biography = ko.observable('');
    self.Seasons = ko.observableArray([])
    self.Teams = ko.observableArray([]);
    self.teamId = ko.observable('');
    self.seasonId = ko.observable('');
    var resultsArray = [];

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayers...');
        var composedUri = self.baseUri() + id;
        
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
        
            self.Id(data.Id);
            self.Name(data.Name);
            self.Birthdate(data.Birthdate);
            self.CountryId(data.CountryId);
            self.CountryName(data.CountryName);
            self.DraftYear(data.DraftYear);
            self.PositionId(data.PositionId);
            self.PositionName(data.PositionName);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.School(data.School);
            self.Photo(data.Photo)
            // Check if self.Photo is falsy or empty
            if (!self.Photo()) {
                // Assign the default image URL
                self.Photo("https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg");
            }
        
            self.Biography(data.Biography);
            self.Seasons(data.Seasons);
            self.Teams(data.Teams);
        
    
            // Define the stats function outside of the loops
            self.stats = function () {
                var resultsArray = [];
                
                self.Teams().forEach(function (team) {
                    self.teamId(team.Id);
    
                    self.Seasons().forEach(function (currentSeason) {
                        self.seasonId(currentSeason.Id);
    
                        var statUri = 'http://192.168.160.58/NBA/api/Statistics/PlayersBySeason?seasonId=' + self.seasonId() + "&teamid=" + self.teamId();
                        
                        ajaxHelper(statUri, 'GET').done(function (data) {
                            console.log(data);
                            hideLoading();
                            var seasonType = data.SeasonType;
                            var players = data.Players;
    
                            if (seasonType === "playoff" && players.some(player => player.Name === self.Name())) {
                                var result = {
                                    Season: data.Season
                                };
                                resultsArray.push(result);
                            }
                        });
                    });
                });
    

            };
    
            // Call the stats function
            self.stats();
            console.log(resultsArray)
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
    };

    

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
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

