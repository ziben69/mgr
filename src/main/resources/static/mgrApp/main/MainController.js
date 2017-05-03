angular.module('mgrApp').controller('MainController', function ($scope, $rootScope) {
    $scope.tooltipKirch = 'W obwodzie zamkniętym suma spadków napięć na wszystkich odbiornikach prądu musi być równa sumie napięć na źródłach napięcia.';
    $scope.tooltipN = 'N - ilość pomiarów';
    $scope.tooltipR = 'R - rezystancja';
    $scope.tooltipL = 'L - indukcyjność';
    $scope.tooltipDt = 'dt - krok całkowania, częstość pomiarów';
    $scope.tooltipUz = 'Uz - napięcie ustalone';
    $scope.tooltipTau = 'Tau - stała czasowa';

    $scope.dt = 0;
    $scope.n = 0;
    $scope.tau = 0;
    $scope.tabX = [];
    $scope.blad1 = [];
    $scope.blad2 = [];
    $scope.wsk1 = [];
    $scope.wsk2 = [];

    $scope.sliderR = 100;
    $scope.sliderL = 1.000;
    $scope.sliderC = 0.001;
    $scope.sliderUz = 230;
    $scope.obwody = ['RL', 'RC'];
    $scope.prad = ['stałe', 'przemienne', 'tętniące'];
    $scope.wybranyObwod = $scope.obwody[0];
    $scope.wybranyPrad = $scope.prad[0];
    $scope.labelR;
    $scope.labelL;
    $scope.labelUz;
    $scope.labelTau;
    $scope.labelDt;
    $scope.labelC;


    $scope.obrazek = false;

    $scope.sliderChange = function () { //metoda wywołuje metodę oblicz podczas przesuwania sliderami
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
    };

    $scope.rlEulerStaly = [];
    $scope.rlAnalStaly = [];
    $scope.rlRKstaly = [];


    var nawiasy = [];
    $scope.obliczWyrazenie = function (sliderR, sliderL, sliderUz, _n, _dt) { //metoda obliczająca wyrażenie ze wzoru
        nawiasy.length = 0;
        var R = sliderR;
        var L = sliderL;
        var Uz = sliderUz;

        var Tau = L / R;
        $scope.tau = Tau;

        var dt = _dt;
        var n = _n;
        var e = 2.718;

        //Deklaracja zmiennych i tablic do RL
        var rlEuler = []
        var rlAnal = [];
        //Deklaracja tablic do Rungego-Kuty
        var rlrk1 = [];
        var rlrk2 = [];
        var rlrk3 = [];
        var rlrk4 = [];
        var rlrk = [];

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
            rlEuler[i] = 0; //Metoda przybliżona (Eulera)
            rlAnal[i] = 0; //Metoda dokładna (analityczna)
            rlrk1[i] = 0;
            rlrk2[i] = 0;
            rlrk3[i] = 0;
            rlrk4[i] = 0;
            rlrk[i] = 0;
        }
        //obliczamy wartosci Yow ze wzoru
        var temp = 0;
        for (var i = 0; i <= n; i++) {

            temp = temp + dt;
            rlEuler[i + 1] = rlEuler[i] + dt * (-rlEuler[i] / Tau + Uz / L); //Metoda przybliżona (Eulera)
            rlAnal[i + 1] = ($scope.sliderUz / $scope.sliderR) * (1 - Math.pow(Math.E, -(temp / Tau))); //Metoda dokładna (analityczna)
            nawiasy.push((-rlEuler[i] / Tau + Uz / L));

            //Metoda Rungego - Kuty
            rlrk1[i + 1] = dt * nawiasy[i];
            rlrk2[i + 1] = dt * (nawiasy[i] + (rlrk1[i] / 2));
            rlrk3[i + 1] = dt * (nawiasy[i] + (rlrk2[i] / 2));
            rlrk4[i + 1] = dt * (nawiasy[i] + rlrk3[i]);
            rlrk[i + 1] = rlrk[i] + ((rlrk1[i] + 2 * rlrk2[i] + 2 * rlrk3[i] + rlrk4[i]) / 6);
        }

        $scope.rlEulerStaly = [];
        $scope.rlAnalStaly = [];
        $scope.rlRKstaly = [];
        $scope.rlRKbez0 = [];

        var temp = 0;
        for (var i = 0; i <= n; i++) {
            var zm = { //tworzymy obiekt z kluczem liczba i wartoscia rlEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rlEuler[i].toFixed(3)
            }
            $scope.rlEulerStaly.push(zm); //dodajemy do listy kazdy obiekt

            var zm2 = { //tworzymy obiekt z kluczem liczba i wartoscia rlEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rlAnal[i].toFixed(3)
            }
            $scope.rlAnalStaly.push(zm2); //dodajemy do listy kazdy obiekt

            var zm3 = { //tworzymy obiekt z kluczem liczba i wartoscia rlEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: rlrk[i].toFixed(3)
            }
            $scope.rlRKstaly.push(zm3); //dodajemy do listy kazdy obiekt

            //Liczymy X
            temp = temp + dt;
            var zm4 = { //tworzymy obiekt z kluczem liczba i wartoscia rlEuler, aby ng-repeater nie mial problemu z powtarzajacymi sie wartosciami w wi
                id: "liczba",
                wartosc: temp.toFixed(3)
            }
            $scope.tabX.push(zm4); //dodajemy do listy kazdy obiekt
        }

        $scope.tabNewX = $scope.tabX.slice(0, -1); //usuwamy ostatni element z tablicy

        $scope.daneDoWykresuX = [];
        $scope.rlEulStaly = [];
        $scope.rlAnStaly = [];
        $scope.rlRKsta = [];

        $scope.blad1 = [];
        $scope.blad2 = [];
        $scope.wsk1 = [];
        $scope.wsk2 = [];
        var uR = [];
        var uL = [];
        var uZ = [];

        for (var i = 0; i < n; i++) {
            $scope.daneDoWykresuX.push($scope.tabNewX[i].wartosc); //robimy sama tablice x z wartosciami, bez klucza do rysowania wykresu
            $scope.rlEulStaly.push($scope.rlEulerStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.rlAnStaly.push($scope.rlAnalStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.blad1.push($scope.rlAnalStaly[i].wartosc - $scope.rlEulerStaly[i].wartosc);

            uR.push($scope.rlEulerStaly[i].wartosc * $scope.sliderR);
            uZ.push($scope.sliderUz);
            //console.log($scope.blad1[i]);
        }
        for (var i = 1; i <= n; i++) {
            $scope.rlRKsta.push($scope.rlRKstaly[i].wartosc); //robimy sama tablice y z wartosciami, osobno, ponieważ brakowało ostatniego elementu
            $scope.blad2.push($scope.rlAnalStaly[i - 1].wartosc - $scope.rlRKstaly[i].wartosc);
        }

        //$scope.rlRKbez0 = $scope.rlRKsta.shift();//usuwamy pierwszy element tablicy (0)

        for (var i = 0; i < nawiasy.length; i++) {
            uL.push(nawiasy[i] * $scope.sliderL);
        }
        //RYSOWANIE WYKRESÓW
        $scope.rysujWykresBledyRL($scope.daneDoWykresuX, $scope.blad1, $scope.blad2); //wywolujemy metode rysujaca wykres
        $scope.rysujWykresKirchoff($scope.daneDoWykresuX, uR, uL, uZ); //wywolujemy metode rysujaca wykres
        $scope.rysujWykresRL($scope.daneDoWykresuX, $scope.rlRKsta, $scope.rlEulStaly, $scope.rlAnStaly); //wywolujemy metode rysujaca wykres
    }

    $scope.rysujWykresBledyRL = function (daneX, blad1, blad2) { //metoda rysująca wykres
        $scope.labels = daneX;
        $scope.series = ['Błąd Euler', 'Błąd RK'];
        var tabTau = [];
        for (var i = 0; i < daneX.length; i++) {
            tabTau.push(1);
        }

        $scope.data = [blad1, blad2];

        $scope.datasetOverride = [{fill: false}, {fill: false}];
        $scope.options = {
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
                    radius: 1
                }
            }
        };
    }
    $scope.rysujWykresKirchoff = function (daneX, daneY, daneZ, daneV) { //metoda rysująca wykres
        $scope.labels2 = daneX;
        $scope.series2 = ['Ur', 'Ul', 'Uz'];

        $scope.data2 = [
            daneY,
            daneZ,
            daneV
        ];
        $scope.datasetOverride2 = [{fill: false}, {fill: false}, {fill: false}];
        $scope.options2 = {
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
                    radius: 1
                }
            }
        };
    }
    $scope.rysujWykresRL = function (daneX, daneY, daneZ, daneV) { //metoda rysująca wykres
        $scope.labels3 = daneX;
        $scope.series3 = ['Metoda Rungego-Kuty', 'Metoda Eulera', 'Metoda analityczna'];

        $scope.data3 = [
            daneY,
            daneZ,
            daneV
        ];
        $scope.datasetOverride3 = [{fill: false}, {fill: false}, {fill: false}];
        $scope.options3 = {
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
                    radius: 1
                }
            }
        };
    }
    $scope.pokazWykresy = function () {
        console.log('napis');
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
    }

    $scope.wybierzFunkcje = function () {
        var wybor = $scope.wybranyObwod;
        if (angular.equals('RL', wybor)) {
            $scope.obrazek = true;

            $scope.labelR = 'R [Ohm]:';
            $scope.labelL = 'L [Henr]:';
            $scope.labelC = 'C [Farad]:';
            $scope.labelDt = 'dt: ';
            $scope.labelTau = 'Tau:';
            $scope.labelUz = 'Uz [V]:';


            $scope.dt = 0.002;
            $scope.n = 20;

            $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
            $scope.sliderC.isHidden = true;

        } else if (angular.equals('RC', wybor)) {
            $scope.labelC = 'C [Farad]:';
            var daneX = [1, 2, 3, 4, 6];
            var daneY = [1, 4, 9, 16, 36];

            $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUz, $scope.n, $scope.dt);
            $scope.sliderL.isHidden = true;
        } else {
            console.log('idot');
        }
    }
    $scope.wybierzFunkcje();
});