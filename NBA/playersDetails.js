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
    self.regularSeasons = ko.observableArray([]);
    self.playoffSeasons = ko.observableArray([]);
    self.pl = ko.observableArray([]);
    self.reg = ko.observableArray([]); 

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
                self.Photo("https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg");
            }
            self.Biography(data.Biography);
            self.Seasons(data.Seasons);
            self.Teams(data.Teams);
        
            //self.statistics = function () {
              //  self.Seasons().forEach(function (currentSeason) {
                //    var seasonId = currentSeason.Id;

                  //  var statUri = 'http://192.168.160.58/NBA/api/Players/Statistics?id='+ self.Id() + '&seasonId=' + seasonId;  
                    //ajaxHelper(statUri, 'GET').done(function (data) {
                      //  console.log(data);
                        //hideLoading();

                        //data.forEach(function (season) {
                          //  if (season.Regular.SeasonType === 'Regular Season') {
                            //    self.reg.push(season)
                            //} else if (season.Playoff.SeasonType === 'Playoffs') {
                              //   self.pl.push(season);
                            //}
                        //});
                    //})
                //})
            //}



            self.statistics();

        
            self.stats = function () {
                var statUri = 'http://192.168.160.58/NBA/api/Statistics/PlayerRankBySeason?playerId=' + self.Id();
                ajaxHelper(statUri, 'GET').done(function (data) {
                    console.log(data);
                    hideLoading();
        
                    // Check and categorize seasons based on SeasonType
                    data.forEach(function (season) {
                        if (season.SeasonType === 'Playoffs') {
                            self.playoffSeasons.push(season)
                        } else if (season.SeasonType === 'Regular Season') {
                            self.regularSeasons.push(season);
                        }
                        // Add more conditions if there are other types of seasons
                    });
        
                    // Now self.playoffSeasons and self.regularSeasons contain the categorized seasons
                    console.log("Playoff Seasons:", self.playoffSeasons());
                    console.log("Regular Seasons:", self.regularSeasons());
                });
            };
        
            // Call the stats function
            self.stats();
            
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

