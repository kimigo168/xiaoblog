$(function(){
    var navTop = $("#navTop");
    var sidebar = $("#sidebar");
    var mask = $(".mask");
    var sidebar_trigger = $("#sidebar_trigger");
    var backButton = $(".back-to-top");
    var more = $(".more");
    function showSidebar(){
        mask.fadeIn();
        // sidebar.animate({'right':0});
        sidebar.css('right',0);//结合transition
    }
    function hideSidebar(){
        mask.fadeOut();
        sidebar.css('right',-sidebar.width());
    }
    sidebar_trigger.on("click",showSidebar);
    mask.on('click',hideSidebar);
    // 返回顶部
    backButton.on('click',function(){
        $('body').animate({
            scrollTop:0
        },800);
    });
    //监听判断，显示返回顶部button
    $(window).on('scroll',function(){
        if($(window).scrollTop() >100 ){//还有小问题直接$(window).height()设置为200
            console.log($(window).height());
            navTop.addClass("navscroll-bg");
            backButton.fadeIn();

        }else{
            backButton.fadeOut();
            navTop.removeClass("navscroll-bg");
        }
    });
    $(window).trigger('scroll');//每次刷新触发scroll事件
    //点击更多的图标的上下移动效果
});