// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Arenas');
    self.displayName = 'NBA Arenas List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.searchlist = ko.observableArray([]);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function (id, q) {
        if (q == undefined) {
            console.log('CALL: getArenas...');
            var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
            console.log(composedUri)
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                hideLoading();
                self.records(data.Records);
                self.currentPage(data.CurrentPage);
                self.hasNext(data.HasNext);
                self.hasPrevious(data.HasPrevious);
                self.pagesize(data.PageSize)
                self.totalPages(data.TotalPages);
                self.totalRecords(data.TotalRecords);
                setFavs(data.Records)
                //self.SetFavourites();
            });
        }
        else {
            var composedUri = self.baseUri() + "/Search?q=" + q;

            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                self.searchlist(data);
                setFavs(data);
                hideLoading();
            });
        }
        self.favorite = function (item){
            let localFavs = JSON.parse(localStorage.getItem("favorites_arenas")) || [];
            console.log(localFavs)
            console.log(item)
            const isFav = localFavs.some((fav) => fav.Id === item.Id)
            console.log(isFav)
            if (isFav){
                localFavs = localFavs.filter((fav) => fav.Id !== item.Id)
            } else {
                localFavs.push(item)
            }
            localStorage.setItem("favorites_arenas", JSON.stringify(localFavs));
            toggleFavClass(item.Id)
        }


    };
    function setFavs(records){
        let localFavs = JSON.parse(localStorage.getItem("favorites_arenas")) || [];
        for (let i = 0; i < records.length; i++){
            let isFav = localFavs.some((fav) => fav.Id === records[i].Id)
            if (isFav){
                toggleFavClass(records[i].Id)
            }
        }
        return records;
    }

    function toggleFavClass(id){
        console.log($(`#favouite_${id}`))
        $(`#favourite_${id}`).toggleClass("fa-heart fa-heart-o text-danger")
    }

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        console.log(uri);

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

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
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
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }; 


    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    var q = getUrlParameter('q');
    console.log(pg, q);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg, q);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})