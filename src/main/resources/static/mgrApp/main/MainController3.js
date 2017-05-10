angular.module('mgrApp').controller('MainController3', function ($scope, $rootScope) {
    $scope.tooltipKirch = 'W obwodzie zamkniętym suma spadków napięć na wszystkich odbiornikach prądu musi być równa sumie napięć na źródłach napięcia.';
    $scope.tooltipN = 'N - ilość pomiarów';
    $scope.tooltipR = 'R - rezystancja';
    $scope.tooltipL = 'L - indukcyjność';
    $scope.tooltipDt = 'dt - krok całkowania, częstość pomiarów';
    $scope.tooltipUm = 'Um - napięcie ustalone';
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

    $scope.sliderUm = 230;

    $scope.labelR;
    $scope.labelL;
    $scope.labelUm;
    $scope.labelTau;
    $scope.labelDt;
    $scope.labelC;


    $scope.obrazek = false;

    $scope.sliderChange = function () { //metoda wywołuje metodę oblicz podczas przesuwania sliderami
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUm, $scope.n, $scope.dt);
    };

    $scope.rlEulerStaly = [];
    $scope.rlAnalStaly = [];
    $scope.rlRKstaly = [];


    var nawiasy = [];
    $scope.obliczWyrazenie = function (sliderR, sliderL, sliderUm, _n, _dt) { //metoda obliczająca wyrażenie ze wzoru
        nawiasy.length = 0;
        var R = sliderR;
        var L = sliderL;
        var Um = sliderUm;

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

        var f = 50;
        var omega = 2 * Math.PI * f;
        var t = 1 / f;

        var uZ = [];
        var uZwlasciwe = [];

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

        temp2 = 0;
        for (var i = 1; i <= n; i++) {
            temp2 = temp2 + dt;
            uZ.push($scope.sliderUm * Math.sin(omega * temp2));
        }
        angular.copy(uZ, uZwlasciwe);//uzWlasciwe = uZ.slice(); // Shallow copy, no reference used.
        //console.log(uZwlasciwe); //panie na kaoncu po za forem to kpiuje caloa tablice
        //obliczamy wartosci Yow ze wzoru
        var temp = 0;
        for (var i = 0; i <= n; i++) {

            temp = temp + dt;
            rlEuler[i + 1] = rlEuler[i] + dt * (-rlEuler[i] / Tau + uZwlasciwe[i] / L); //Metoda przybliżona (Eulera)
            rlAnal[i + 1] = (uZwlasciwe[i] / $scope.sliderR) * (1 - Math.pow(Math.E, -(temp / Tau))); //Metoda dokładna (analityczna)
            nawiasy.push((-rlEuler[i] / Tau + uZwlasciwe[i] / L));

            //Metoda Rungego - Kuty
            rlrk1[i + 1] = dt * nawiasy[i];
            rlrk2[i + 1] = dt * (nawiasy[i] + (rlrk1[i] / 2));
            rlrk3[i + 1] = dt * (nawiasy[i] + (rlrk2[i] / 2));
            rlrk4[i + 1] = dt * (nawiasy[i] + rlrk3[i]);
            rlrk[i + 1] = rlrk[i] + ((rlrk1[i] + 2 * rlrk2[i] + 2 * rlrk3[i] + rlrk4[i]) / 6);
        }
        //console.log(nawiasy);
        $scope.rlEulerStaly = [];
        $scope.rlAnalStaly = [];
        $scope.rlRKstaly = [];
        $scope.rlRKbez0 = [];

        var temp = 0;

        var z = {
            id:"liczba",
            wartosc:0.000
        };
        $scope.tabX.push(z);

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

        var uZzera = [];


        for (var i = 0; i < n; i++) {
            $scope.daneDoWykresuX.push($scope.tabNewX[i].wartosc); //robimy sama tablice x z wartosciami, bez klucza do rysowania wykresu
            $scope.rlEulStaly.push($scope.rlEulerStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.rlAnStaly.push($scope.rlAnalStaly[i].wartosc); //robimy sama tablice y z wartosciami, bez klucza do rysowania wykresu
            $scope.blad1.push($scope.rlAnalStaly[i].wartosc - $scope.rlEulerStaly[i].wartosc);
            uR.push($scope.rlEulerStaly[i].wartosc * $scope.sliderR);

        }

        for (var i = 1; i <= n; i++) {

            // console.log(i);
            // console.log(uZ[i]);

            if (uZ[i] < 0) {
                uZ[i] = 0;
                uZzera.push(uZ[i]);
                // console.log(uZ[i]);
            } else {
                uZzera.push(uZ[i]);
                //console.log(uZ[i]);
            }

            $scope.rlRKsta.push($scope.rlRKstaly[i].wartosc); //robimy sama tablice y z wartosciami, osobno, ponieważ brakowało ostatniego elementu
            $scope.blad2.push($scope.rlAnalStaly[i - 1].wartosc - $scope.rlRKstaly[i].wartosc);
        }


        for (var i = 0; i < nawiasy.length; i++) {
            uL.push(nawiasy[i] * $scope.sliderL);
        }
        //RYSOWANIE WYKRESÓW
        $scope.rysujWykresBledyRL($scope.daneDoWykresuX, $scope.blad1, $scope.blad2); //wywolujemy metode rysujaca wykres
        $scope.rysujWykresKirchoff($scope.daneDoWykresuX, uR, uL, uZwlasciwe, uZ); //wywolujemy metode rysujaca wykres
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
                    radius: 3
                }
            }
        };
    }
    $scope.rysujWykresKirchoff = function (daneX, daneY, daneZ, daneV, daneC) { //metoda rysująca wykres
        $scope.labels2 = daneX;
        $scope.series2 = ['Ur', 'Ul', 'Uz', 'Uz2'];

        $scope.data2 = [
            daneY,
            daneZ,
            daneV,
            daneC
        ];
        $scope.datasetOverride2 = [{fill: false}, {fill: false}, {fill: false}, {fill: false}];
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
                    radius: 3
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
                    radius: 3
                }
            }
        };
    }
    $scope.pokazWykresy = function () {
        console.log('napis');
        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUm, $scope.n, $scope.dt);
    }

    $scope.wybierzFunkcje = function () {

        $scope.obrazek = true;
        $scope.labelR = 'R [Ohm]:';
        $scope.labelL = 'L [Henr]:';
        $scope.labelDt = 'dt: ';
        $scope.labelTau = 'Tau:';
        $scope.labelUm = 'Um [V]:';
        $scope.dt = 0.002;
        $scope.n = 20;

        $scope.obliczWyrazenie($scope.sliderR, $scope.sliderL, $scope.sliderUm, $scope.n, $scope.dt);

    }
    $scope.wybierzFunkcje();
});