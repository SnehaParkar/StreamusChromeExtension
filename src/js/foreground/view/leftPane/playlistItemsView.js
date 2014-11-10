﻿define([
    'common/enum/listItemType',
    'foreground/view/behavior/collectionViewMultiSelect',
    'foreground/view/behavior/slidingRender',
    'foreground/view/behavior/sortable',
    'foreground/view/behavior/tooltip',
    'foreground/view/leftPane/playlistItemView',
    'text!template/leftPane/playlistItems.html'
], function (ListItemType, CollectionViewMultiSelect, SlidingRender, Sortable, Tooltip, PlaylistItemView, PlaylistItemsTemplate) {
    'use strict';

    var PlaylistItemsView = Backbone.Marionette.CompositeView.extend({
        id: 'playlistItems',
        className: 'column u-flex--column u-flex--full',
        childViewContainer: '@ui.childContainer',
        childView: PlaylistItemView,
        childViewType: ListItemType.PlaylistItem, 
        childViewOptions: function () {
            return {
                type: this.childViewType,
                parentId: this.ui.childContainer[0].id
            };
        },

        //  Overwrite resortView to only render children as expected
        resortView: function () {
            this._renderChildren();
        },
        
        template: _.template(PlaylistItemsTemplate),
        templateHelpers: {  
            showSearchMessage: chrome.i18n.getMessage('showSearch'),
            searchForSongsMessage: chrome.i18n.getMessage('searchForSongs'),
            playlistEmptyMessage: chrome.i18n.getMessage('playlistEmpty'),
            wouldYouLikeToMessage: chrome.i18n.getMessage('wouldYouLikeTo')
        },
        
        ui: {
            playlistEmptyMessage: '#playlistItems-playlistEmptyMessage',
            childContainer: '#playlistItems-listItems',
            showSearchLink: '#playlistItems-showSearchLink'
        },
        
        events: {
            'click @ui.showSearchLink': '_onClickShowSearchLink'
        },
        
        collectionEvents: {
            //  Don't use _onCollection because it conflicts with Marionette functions.
            'add': '_onPlaylistItemsAdd',
            'remove': '_onPlaylistItemsRemove',
            'reset': '_onPlaylistItemsReset'
        },

        behaviors: {
            CollectionViewMultiSelect: {
                behaviorClass: CollectionViewMultiSelect,
            },
            SlidingRender: {
                behaviorClass: SlidingRender
            },
            Sortable: {
                behaviorClass: Sortable
            },
            Tooltip: {
                behaviorClass: Tooltip
            }
        },
        
        onRender: function () {
            this._toggleInstructions(this.collection.isEmpty());
        },
        
        _onPlaylistItemsAdd: function() {
            this._toggleInstructions(false);
        },
        
        _onPlaylistItemsRemove: function(model, collection) {
            this._toggleInstructions(collection.isEmpty());
        },
        
        _onPlaylistItemsReset: function (collection) {
            this._toggleInstructions(collection.isEmpty());
        },

        _toggleInstructions: function (collectionEmpty) {
            this.ui.playlistEmptyMessage.toggleClass('hidden', !collectionEmpty);
        },

        _onClickShowSearchLink: function () {
            Streamus.channels.searchArea.commands.trigger('show:search');
        }
    });

    return PlaylistItemsView;
});