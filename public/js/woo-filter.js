var screenSize = {
    'width' : $(window).width(),
    'height' : $(window).height()
};

$(document).ready(function(){
    $('.element a').click(function(e){e.preventDefault();});
    
    function showGrid(filter){
        var gridVar = {
            size : $('#grid').width()
        };
        
        
        $('#grid').attr('data-filter',filter);
        
        
        
        var nb_element = 0;
        var colonne    = 0;
        var ligne      = 0;
        
        $('.element').each(function(){
            
            var filterElement = ($(this).attr('data-filter')).split(',');

            if(filter === '0' || filterElement.indexOf(filter) > -1){
                $(this).fadeIn(300);
                
                var leftElement = 0;
                var topElement  = 0;
                colonne ++;
                
                if(colonne === gridVar.numb){
                    colonne = 0;
                    ligne++;
                }
                nb_element ++;
            }
            else{
                $(this).fadeOut(300);
            }
        });
    }
    showGrid('0');
    
    
    
    $('#filter ul li a').click(function(e){
        e.preventDefault();
        $('#filter ul li a').removeClass('select');
        $(this).addClass('select');
        
        $('#filter p').html($(this).html());
        
        var filterGrid = $(this).attr('data-filter');
        showGrid(filterGrid);
        
        if(screenSize.width < 960){
            $('#filter p').click();
        }
    });
    
    
        
});