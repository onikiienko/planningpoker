/*jshint globalstrict: true*/
define('views/room', [
    'text!templates/roomTemplates/room.html',
    'models/chat',
    'io/main',
    'backbone',
    'underscore'
], function(roomTemplate, ChatModel, io, Backbone, _) {
  let RoomView = Backbone.View.extend({
    el: '.main-content',
    events: {
      "click .tab__nav" : "showTab",
      "click #sendMsg" : "sendMessage"
    },
    template : _.template(roomTemplate),
    initialize: function(){
        this.render();
    },
    render: function(){
      $(this.el).html(this.template());
    },
    showTab: function(e){
      let target = $(e.target);
      let bind = target.attr('bind');
      let query = ".tab__content--item[bind='" + bind + "']";
      let tabNav = $(target.closest('.tab__nav'));
      let allnavItems = tabNav.find('li');
      let allTabPanelBodyItem = $('.tab__content');
      let tabItems = $('.tab__content--item');
      let currentTabPanelBodyItem = allTabPanelBodyItem.find(query);

      ////handle navigate
      allnavItems.removeClass('tab__nav--active');
      target.addClass('tab__nav--active');

      ////handle body
      tabItems.removeClass('content--active');
      tabItems.hide();
      currentTabPanelBodyItem.toggleClass('content--active');
      currentTabPanelBodyItem.fadeIn();
    },
    sendMessage: function(){  
      let playerObject = {
        avatar: window.headerModel.get('avatar'),
        name: window.headerModel.get('name')
      };

      let text = $('.textarea').val();
      
      $('.textarea').val('');

      let model = new ChatModel({
        contributor: playerObject,
        text: text,
        date: new Date()
      });

      io.sendMessage(model);
    }
  });

  return RoomView;

});
