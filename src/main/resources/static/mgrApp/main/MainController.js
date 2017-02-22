angular.module('mgrApp').controller('MainController', function($scope, $rootScope) {
    $scope.message = 'Pisze w widoku z MainController';
    $scope.dt = 0;
    $scope.n = 0;
    $scope.tau = 0;
    $scope.tabWynikow = [];
    $scope.tabX = [];
    $scope.ostatecznyWynik = 0;

    $scope.sliderR = 100;
    $scope.sliderL = 1.000;
    $scope.sliderUz = 100;

    var zainicjalizuj = function(){

      $scope.dt = 0.002;
      $scope.n = 35;
      $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
    }


    $scope.sliderChange = function(sliderId) { //metoda wywołuje metodę oblicz podczas przesuwania sliderami
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
    };

    $scope.wyniki = []
    $scope.obliczWyrazenie = function(sliderR, sliderL, sliderUz, _n, _dt) { //metoda obliczająca wyrażenie ze wzoru
        var R = sliderR;
        var L = sliderL;
        var Uz = sliderUz;
        var Tau = L / R;
        var dt = _dt;
        var n = _n;
        var pr = []
        $scope.tabX = [];

        //inicjalizacja tablicy zerami
        for (var i = 0; i <= n; i++) {
            pr[i] = 0;
        }

        //obliczamy wartosci Yow ze wzoru
        for (var i = 0; i <= n; i++) {
            pr[i + 1] = pr[i + 1] = pr[i] + dt * (-pr[i] / Tau + Uz / L);
        }


        $scope.wyniki = [];
        var temp = 0;
        for (var i = 0; i <= n; i++) {
            var zm = { //tworzymy obiekt z kluczem liczba i wartoscia pr, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: pr[i].toFixed(4)
            }
            $scope.wyniki.push(zm); //dodajemy do listy kazdy obiekt

            //Liczymy X
            temp = temp + dt;
            var zm2 = { //tworzymy obiekt z kluczem liczba i wartoscia pr, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: temp.toFixed(6)
            }
            $scope.tabX.push(zm2); //dodajemy do listy kazdy obiekt
        }
        //console.log('Rozmiar' + $scope.wyniki.length);

        $scope.tabNewX = $scope.tabX.slice(0, -1); //usuwamy ostatni element z tablicy
        var daneDoWykresuX = [];
        var daneDoWykresuY = [];
        for (var i = 0; i < n; i++) {

            daneDoWykresuX.push($scope.tabNewX[i].wartosc); //robimy sama tablice x z wartosciami, bez klucza do rysowania wykresu
            daneDoWykresuY.push($scope.wyniki[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu

        }

        $scope.rysujWykres(daneDoWykresuX, daneDoWykresuY); //wywolujemy metode rysujaca wykres
    }

    $scope.rysujWykres = function(daneX, daneY) { //metoda rysująca wykres
        $scope.labels = daneX;
        $scope.series = ['X'];
        $scope.data = [daneY];
        $scope.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }, ]
            },
            elements: {
                        point: {
                            radius: 0
                        }
                    }
        };
    }
    zainicjalizuj();
    $scope.pokazWykresy = function(){
           console.log('napis');
          $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
    }
});