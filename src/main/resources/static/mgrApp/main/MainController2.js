angular.module('mgrApp').controller('MainController2', function ($scope, $rootScope) {
    $scope.tooltipKirch2 = 'W obwodzie zamkniętym suma spadków napięć na wszystkich odbiornikach prądu musi być równa sumie napięć na źródłach napięcia.';
    $scope.tooltipN2 = 'N - ilość pomiarów';
    $scope.tooltipR2 = 'R - rezystancja';
    $scope.tooltipC2 = 'C - pojemność kondensatora';
    $scope.tooltipDt2 = 'dt - krok całkowania, częstość pomiarów';
    $scope.tooltipUz2 = 'Uz - napięcie ustalone';
    $scope.tooltipTau2 = 'Tau - stała czasowa';

    $scope.dt = 0;
    $scope.n = 0;
    $scope.tau = 0;
    $scope.tabX = [];
    $scope.blad1 = [];
    $scope.blad2 = [];
    $scope.wsk1 = [];
    $scope.wsk2 = [];

    $scope.sliderR = 100;
    $scope.sliderC = 0.001;
    $scope.sliderUz = 230;
    $scope.prad = ['stałe', 'przemienne', 'tętniące'];
    $scope.wybranyPrad = $scope.prad[0];
    $scope.labelR;
    $scope.labelC;
    $scope.labelUz;
    $scope.labelTau;
    $scope.labelDt;
    $scope.labelC;


    $scope.obrazek = false;

    $scope.sliderChange = function () { //metoda wywołuje metodę oblicz podczas przesuwania sliderami
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderC, $scope.sliderUz, $scope.n, $scope.dt);
    };

    $scope.rcEulerStaly = [];
    $scope.rcAnalStaly = [];
    $scope.rcRKstaly = [];


    var nawiasy = [];
    $scope.obliczWyrazenie = function (sliderR, sliderC, sliderUz, _n, _dt) { //metoda obliczająca wyrażenie ze wzoru
        nawiasy.length = 0;
        var R = sliderR;
        var C = sliderC;
        var Uz = sliderUz;

        var Tau2 = R * C;
        $scope.tau = Tau2;

        var dt = _dt;
        var n = _n;
        var e = 2.718;

        //Deklaracja zmiennych i tablic do RC
        var rcEuler = []
        var rcAnal = [];
        //Deklaracja tablic do Rungego-Kuty
        var rcrk1 = [];
        var rcrk2 = [];
        var rcrk3 = [];
        var rcrk4 = [];
        var rcrk = [];

        //Deklaracja zmiennych i tablic do RC
        var rcEuler = [];
        var rcAnal = [];
        //Deklaracja tablic do Runge'go-Kuty
        var rcrk1 = [];
        var rcrk2 = [];
        var rcrk3 = [];
        var rcrk4 = [];
        var rcrk = [];

        //
        $scope.tabX = [];


        //inicjalizacja tablicy zerami
        for (var i = 0; i <= n; i++) {
            rcEuler[i] = 0; //Metoda przybliżona (Eulera)
            rcAnal[i] = 0; //Metoda dokładna (analityczna)
            rcrk1[i] = 0;
            rcrk2[i] = 0;
            rcrk3[i] = 0;
            rcrk4[i] = 0;
            rcrk[i] = 0;
        }
        //obliczamy wartosci Yow ze wzoru
        var temp = 0;
        for (var i = 0; i <= n; i++) {

            temp = temp + dt;

            rcEuler[i + 1] = rcEuler[i] + dt * (-rcEuler[i] / Tau2 + Uz / Tau2); //do poprawy Metoda przybliżona (Eulera)
            rcAnal[i + 1] = $scope.sliderUz  * (1 - Math.pow(Math.E, -(temp / Tau2))); //Metoda dokładna (analityczna)

            nawiasy.push((-rcEuler[i] / Tau2 + Uz / Tau2));


            //Metoda Rungego - Kuty
            rcrk1[i + 1] = dt * nawiasy[i];
            rcrk2[i + 1] = dt * (nawiasy[i] + (rcrk1[i] / 2));
            rcrk3[i + 1] = dt * (nawiasy[i] + (rcrk2[i] / 2));
            rcrk4[i + 1] = dt * (nawiasy[i] + rcrk3[i]);
            rcrk[i + 1] = rcrk[i] + ((rcrk1[i] + 2 * rcrk2[i] + 2 * rcrk3[i] + rcrk4[i]) / 6);
        }

        $scope.rcEulerStaly = [];
        $scope.rcAnalStaly = [];
        $scope.rcRKstaly = [];
        $scope.rcRKbez0 = [];

        var temp = 0;

        var z = {
            id:"liczba",
            wartosc:0.000
        };
        $scope.tabX.push(z);

        for (var i = 0; i <= n; i++) {
            var zm = { //tworzymy obiekt z kluczem liczba i wartoscia rcEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rcEuler[i].toFixed(3)
            }
            $scope.rcEulerStaly.push(zm); //dodajemy do listy kazdy obiekt

            var zm2 = { //tworzymy obiekt z kluczem liczba i wartoscia rcEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rcAnal[i].toFixed(3)
            }
            $scope.rcAnalStaly.push(zm2); //dodajemy do listy kazdy obiekt

            var zm3 = { //tworzymy obiekt z kluczem liczba i wartoscia rcEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rcrk[i].toFixed(3)
            }
            $scope.rcRKstaly.push(zm3); //dodajemy do listy kazdy obiekt

            //Liczymy X
            temp = temp + dt;
            var zm4 = { //tworzymy obiekt z kluczem liczba i wartoscia rcEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: temp.toFixed(3)
            }
            $scope.tabX.push(zm4); //dodajemy do listy kazdy obiekt
        }

        $scope.tabNewX = $scope.tabX.slice(0, -1); //usuwamy ostatni element z tablicy

        $scope.daneDoWykresuX = [];
        $scope.rcEulStaly = [];
        $scope.rcAnStaly = [];
        $scope.rcRKsta = [];

        $scope.blad1 = [];
        $scope.blad2 = [];
        $scope.wsk1 = [];
        $scope.wsk2 = [];
        var uR = [];
        var uC = [];
        var uZ = [];

        for (var i = 0; i < n; i++) {
            $scope.daneDoWykresuX.push($scope.tabNewX[i].wartosc); //robimy sama tablice x z wartosciami, bez klucza do rysowania wykresu
            $scope.rcEulStaly.push($scope.rcEulerStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.rcAnStaly.push($scope.rcAnalStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.blad1.push($scope.rcAnalStaly[i].wartosc - $scope.rcEulerStaly[i].wartosc);

            uR.push($scope.rcEulerStaly[i].wartosc * $scope.sliderR);
            uZ.push($scope.sliderUz);
            //console.log($scope.blad1[i]);
        }
        for (var i = 1; i <= n; i++) {
            $scope.rcRKsta.push($scope.rcRKstaly[i].wartosc); //robimy sama tablice y z wartosciami, osobno, ponieważ brakowało ostatniego elementu
            $scope.blad2.push($scope.rcAnalStaly[i - 1].wartosc - $scope.rcRKstaly[i].wartosc);
        }

        //$scope.rcRKbez0 = $scope.rcRKsta.shift();//usuwamy pierwszy element tablicy (0)

        for (var i = 0; i < nawiasy.length; i++) {
            uC.push(nawiasy[i] * $scope.sliderC);
        }
        //RYSOWANIE WYKRESÓW
        $scope.rysujWykresBledyRC($scope.daneDoWykresuX, $scope.blad1, $scope.blad2); //wywolujemy metode rysujaca wykres
        $scope.rysujWykresKirchoff($scope.daneDoWykresuX, uR, uC, uZ); //wywolujemy metode rysujaca wykres
        $scope.rysujWykresRC($scope.daneDoWykresuX, $scope.rcRKsta, $scope.rcEulStaly, $scope.rcAnStaly); //wywolujemy metode rysujaca wykres
    }

    $scope.rysujWykresBledyRC = function (daneX, blad1, blad2) { //metoda rysująca wykres
        $scope.labels4 = daneX;
        $scope.series4 = ['Błąd Euler', 'Błąd RK'];
        var tabTau = [];
        for (var i = 0; i < daneX.length; i++) {
            tabTau.push(1);
        }

        $scope.data4 = [blad1, blad2];

        $scope.datasetOverride4 = [{fill: false}, {fill: false}];
        $scope.options4 = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }]
            },
            elements: {
                point: {
                    radius: 3
                }
            }
        };
    }
    $scope.rysujWykresKirchoff = function (daneX, daneY, daneZ, daneV) { //metoda rysująca wykres
        $scope.labels5 = daneX;
        $scope.series5 = ['Ur', 'Uc', 'Uz'];

        $scope.data5 = [
            daneY,
            daneZ,
            daneV
        ];
        $scope.datasetOverride5 = [{fill: false}, {fill: false}, {fill: false}];
        $scope.options5 = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                    }
                ]
            },
            elements: {
                point: {
                    radius: 3
                }
            }
        };
    }
    $scope.rysujWykresRC = function (daneX, daneY, daneZ, daneV) { //metoda rysująca wykres
        $scope.labels6 = daneX;
        $scope.series6 = ['Metoda Rungego-Kuty', 'Metoda Eulera', 'Metoda analityczna'];

        $scope.data6 = [
            daneY,
            daneZ,
            daneV
        ];
        $scope.datasetOverride6 = [{fill: false}, {fill: false}, {fill: false}];
        $scope.options6 = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                    }
                ]
            },
            elements: {
                point: {
                    radius: 3
                }
            }
        };
    }
    $scope.pokazWykresy = function () {
        console.log('napis');
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderC, $scope.sliderUz, $scope.n, $scope.dt);
    }

    $scope.wybierzFunkcje = function () {

        $scope.obrazek = true;
        $scope.labelR = 'R [Ohm]:';
        $scope.labelC = 'C [Farad]:';
        $scope.labelDt = 'dt: ';
        $scope.labelTau = 'Tau:';
        $scope.labelUz = 'Uz [V]:';
        $scope.dt = 0.002;
        $scope.n = 20;

        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderC, $scope.sliderUz, $scope.n, $scope.dt);

    }
    $scope.wybierzFunkcje();
});