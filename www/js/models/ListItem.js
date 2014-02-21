window.ListItem = Backbone.Model.extend({
    
    defaults: function() {
        return {
            title: "empty list item",
            order: checklist.nextOrder(), // refers to an instance of the Checklist collection
            checked: false
        };
    },

    toggle: function() {
        this.save({done: !this.get("checked")});
    },

    initialize:function () {
    }

});