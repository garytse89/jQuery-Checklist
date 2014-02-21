window.ListItem = Backbone.Model.extend({
    
    defaults: function() {
        return {
            title: "empty list item",
            // order: Todos.nextOrder(),
            checked: false
        };
    },

    toggle: function() {
        this.save({done: !this.get("checked")});
    },

    initialize:function () {
    }

});