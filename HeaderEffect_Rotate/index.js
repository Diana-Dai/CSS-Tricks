
//document.ready
$(document).ready(()=>{
    $('body').addClass('mobile'); //Assume Mobile as default
    environmentChecker()
    $(window).resize(()=> environmentChecker()) //Check again when window resizes
})

//Enviroment Test 
//Check if Mobile, Desktop or Tablet
const environmentChecker = ()=> {
    //desktopcheck
    if ($(window).width() >= 960) {
        scrollControl()
        $('body').removeClass('mobile').removeClass('tablet').addClass('desktop');
    //tabletcheck
    } else if ($(window).width() >= 600) {
        scrollControl()
        $('body').removeClass('mobile').removeClass('desktop').addClass('tablet');
    } else {
        $('body').removeClass('tablet').removeClass('desktop').addClass('mobile');
        // mobileControl()
    };

}; //environmentChecker




// Scroll control
const scrollControl = ()=> {
    $(document).ready(function () {
        $(window).scroll(i => {
            if ($(window).scrollTop() > "100") {
                $('header').addClass("fixedtop")
                $('header').removeClass('normal')
            } else {
                $('header').removeClass("fixedtop")
            }
            console.log($("body").scrollTop())
        })

        $(".top").click(() => {
            $("header").toggleClass("topspin")
        })
        $(".front").click(() => {
            $("header").toggleClass("topspin")
        })
        $("header").find("a").click((e) => {
            e.stopPropagation();
        })
    });
}

