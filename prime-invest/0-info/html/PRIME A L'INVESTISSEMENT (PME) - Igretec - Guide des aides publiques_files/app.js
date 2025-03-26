jQuery(document).ready(function ($) {

    //$(".navbar-right>li:first-child").addClass("dropdown find-help");
    //Sous menu
    //On récupère ce qu'on a créé en php dans header.php
    var menuToAppend = $(".menuToAppend").html();
    var formToAppend = $(".formToAppend").html();
    //On l'ajoute au menu en 2ème position
    $('#menu-menu-1 li:eq(0)').before(menuToAppend);
    $('#menu-menu-1').before(formToAppend);

    //Lance une recherche quan on clique sur la loupe
    $("#searchform .glyphicon").click(function() {
        $("#searchform").submit();
    });

    var dynatable = $('#my-table').bind(
        {
            'dynatable:init': function (e, dynatable) {
                dynatable.queries.functions['profil'] = function (record, queryValue) {
                    var myQuery = record.profil;
                    var position = myQuery.indexOf(queryValue);
                    if (position != -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                    ,
                    dynatable.queries.functions['theme'] = function (record, queryValue) {
                        var myQuery = record.theme;
                        var position = myQuery.indexOf(queryValue);
                        if (position != -1) {
                            return true;
                        } else {
                            return false;
                        }
                    };
            }
        }
    ).dynatable({
        features: {
            paginate: true,
            recordCount: false,
            sorting: true,
            pushState: false,
            search: false
        }
        ,
        inputs: {
            queries: $('#search-theme,#search-profil,#search'),
            perPagePlacement: 'after',
            perPageText: 'Afficher: ',
        }
    }).data('dynatable');

    $('#search').change(function () {
        var value = $(this).val();
        if (value === "") {
            dynatable.queries.remove("search");
        } else {
            dynatable.queries.add("search", value);
        }
        dynatable.process();
    });
//on récupère l'url
    var str = window.location.href;
    //on en fait un tableau splite sur le/
    var res = str.split("/");
    //On récupère si la categ est profil ou theme
    var categ = res[4];
    //on récupère la taxonomy
    var value = res[5];
    //on vérifie qu'on est pas sur la page aide
    if (typeof value != 'undefined') {
        if (categ == "profil") {
            if (value === "") {
                dynatable.queries.remove("profil");
            } else {
                //On met dans le select la taxonomy q'on a récupéré
                $('#search-profil').val(value);
                //On dit à dynatable d'afficher seulement cette taxonomy
                dynatable.queries.add("profil", value);
            }
            dynatable.process();
        } else if (categ == "theme") {
            if (value === "") {
                dynatable.queries.remove("theme");
            } else {
                $('#search-theme').val(value);
                dynatable.queries.add("theme", value);
            }
            dynatable.process();
        }
    }
    // lien igretec du menu + target blank
    jQuery('a[href="https://www.igretec.com/fr/"]').attr('target','_blank');

    ///////Newsletter
    $("#newsletter").validate();
    $("#newsletter").submit(function( e ) {
        var isvalid = $("#newsletter").valid();
        if (isvalid) {
            e.preventDefault();
            var emailnewsletter = $('#emailnewsletter ').val();
            var firstnamenewsletter  = $('#firstnamenewsletter ').val();
            var lastnamenewsletter = $('#lastnamenewsletter').val();

            var request = $.ajax({
                url: "/wp-content/themes/spada/lib/newsletter.php",
                method: "POST",
                data: { emailnewsletter : emailnewsletter , firstnamenewsletter : firstnamenewsletter , lastnamenewsletter : lastnamenewsletter },
                dataType: "html"
            });

            request.done(function( msg ) {
                $( "#newsletter-message" ).html( msg );
                $('#emailnewsletter').val('');
                $('#firstnamenewsletter').val('');
                $('#lastnamenewsletter').val('');

            });

            request.fail(function( jqXHR, textStatus) {
                console.log("Request failed: "+textStatus);
            });
        }
	});
/////////////////

});