var AutoModeSettings, Cell, CellCollection, CellTemplate, CellTemplateCollection, CollectionBase, CustomFieldFilter, CustomFieldFilterCollection, Font, FontCollection, FontSettings, GridEditorModel, HoverOptions, LayoutModeSettings, LayoutSettings, LightboxOptions, LinkOptions, NestedModel, PaginationSettings, TaxonomyFilter, TaxonomyFilterCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

NestedModel = (function(_super) {
    __extends(NestedModel, _super);

    function NestedModel() {
        return NestedModel.__super__.constructor.apply(this, arguments);
    }

    NestedModel.prototype.nested = {};

    NestedModel.prototype.initialize = function() {
        var klass, name, _ref, _results;
        NestedModel.__super__.initialize.apply(this, arguments);
        _ref = this.nested;
        _results = [];
        for (name in _ref) {
            klass = _ref[name];
            _results.push(this.set(name, new klass));
        }
        return _results;
    };

    NestedModel.prototype.toJSON = function() {
        var json, name;
        json = NestedModel.__super__.toJSON.apply(this, arguments);
        for (name in this.nested) {
            json[name] = this.get(name).toJSON();
        }
        return json;
    };

    NestedModel.prototype.parse = function(data) {
        var attr, existing, prop;
        if (!(_.isObject(data) || _.isUndefined(data))) {
            data = JSON.parse(data);
        }
        if (_.isUndefined(data) || !data) {
            return data;
        }
        for (prop in this.nested) {
            attr = data[prop];
            if ((existing = this.get(prop))) {
                data[prop] = existing;
            } else {
                data[prop] = new this.nested[prop];
            }
            data[prop].set(data[prop].parse(attr));
        }
        return data;
    };

    NestedModel.prototype.clone = function() {
        var clone, prop;
        clone = NestedModel.__super__.clone.apply(this, arguments);
        for (prop in this.nested) {
            clone.set(prop, this.get(prop).clone());
        }
        return clone;
    };

    return NestedModel;

})(Backbone.Model);

CollectionBase = (function(_super) {
    __extends(CollectionBase, _super);

    function CollectionBase() {
        this.parse = __bind(this.parse, this);
        return CollectionBase.__super__.constructor.apply(this, arguments);
    }

    CollectionBase.prototype.parse = function(items) {
        return _.map(items, (function(_this) {
            return function(item) {
                var newItem;
                newItem = new _this.model;
                return newItem.set(newItem.parse(item));
            };
        })(this));
    };

    return CollectionBase;

})(Backbone.Collection);

HoverOptions = (function(_super) {
    __extends(HoverOptions, _super);

    function HoverOptions() {
        return HoverOptions.__super__.constructor.apply(this, arguments);
    }

    HoverOptions.prototype.defaults = {
        position: 'top_left',
        background_image_position: 'repeat'
    };

    return HoverOptions;

})(NestedModel);

LightboxOptions = (function(_super) {
    __extends(LightboxOptions, _super);

    function LightboxOptions() {
        this.isImageOrGrid = __bind(this.isImageOrGrid, this);
        return LightboxOptions.__super__.constructor.apply(this, arguments);
    }

    LightboxOptions.prototype.defaults = {
        mode: 'image',
        description_style: 'mini'
    };

    LightboxOptions.prototype.isImage = function() {
        return this.get('mode') === 'image';
    };

    LightboxOptions.prototype.isGrid = function() {
        return this.get('mode') === 'ubergrid';
    };

    LightboxOptions.prototype.isIframe = function() {
        var _ref;
        return (_ref = this.get('mode')) === 'iframe' || _ref === 'ubergrid';
    };

    LightboxOptions.prototype.isImageOrGrid = function() {
        return this.isImage() || this.isGrid();
    };

    return LightboxOptions;

})(NestedModel);

LinkOptions = (function(_super) {
    __extends(LinkOptions, _super);

    function LinkOptions() {
        return LinkOptions.__super__.constructor.apply(this, arguments);
    }

    LinkOptions.prototype.nested = {
        lightbox: LightboxOptions
    };

    LinkOptions.prototype.defaults = {
        mode: 'url'
    };

    return LinkOptions;

})(NestedModel);

Cell = (function(_super) {
    __extends(Cell, _super);

    function Cell() {
        return Cell.__super__.constructor.apply(this, arguments);
    }

    Cell.prototype.nested = {
        hover: HoverOptions,
        label: Backbone.Model,
        link: LinkOptions
    };

    Cell.prototype.defaults = function() {
        return {
            layout: 'r1c1-io',
            title_position: 'center',
            title_background_image_position: 'repeat'
        };
    };

    Cell.prototype.clone = function() {
        return this.collection.add(Cell.__super__.clone.apply(this, arguments));
    };

    return Cell;

})(NestedModel);

CellTemplate = (function(_super) {
    __extends(CellTemplate, _super);

    function CellTemplate() {
        return CellTemplate.__super__.constructor.apply(this, arguments);
    }

    CellTemplate.prototype.defaults = function() {
        return _.extend(CellTemplate.__super__.defaults.apply(this, arguments), {
            criteria: 'order'
        });
    };

    CellTemplate.prototype.isPHP = function() {
        return this.get('criteria') === 'php';
    };

    CellTemplate.prototype.initialize = function() {
        CellTemplate.__super__.initialize.apply(this, arguments);
        if (!this.get('criteria')) {
            return this.set('criteria') === 'order';
        }
    };

    return CellTemplate;

})(Cell);

CellCollection = (function(_super) {
    __extends(CellCollection, _super);

    function CellCollection() {
        return CellCollection.__super__.constructor.apply(this, arguments);
    }

    CellCollection.prototype.model = Cell;

    return CellCollection;

})(CollectionBase);

CellTemplateCollection = (function(_super) {
    __extends(CellTemplateCollection, _super);

    function CellTemplateCollection() {
        return CellTemplateCollection.__super__.constructor.apply(this, arguments);
    }

    CellTemplateCollection.prototype.model = CellTemplate;

    CellTemplateCollection.prototype.initialize = function() {
        CellTemplateCollection.__super__.initialize.apply(this, arguments);
        if (this.lentgh === 0) {
            return this.add({});
        }
    };

    return CellTemplateCollection;

})(CellCollection);

TaxonomyFilter = (function(_super) {
    __extends(TaxonomyFilter, _super);

    function TaxonomyFilter() {
        return TaxonomyFilter.__super__.constructor.apply(this, arguments);
    }

    TaxonomyFilter.prototype.defaults = {
        operator: 'IN'
    };

    return TaxonomyFilter;

})(Backbone.Model);

TaxonomyFilterCollection = (function(_super) {
    __extends(TaxonomyFilterCollection, _super);

    function TaxonomyFilterCollection() {
        return TaxonomyFilterCollection.__super__.constructor.apply(this, arguments);
    }

    TaxonomyFilterCollection.prototype.model = TaxonomyFilter;

    return TaxonomyFilterCollection;

})(CollectionBase);

CustomFieldFilter = (function(_super) {
    __extends(CustomFieldFilter, _super);

    function CustomFieldFilter() {
        return CustomFieldFilter.__super__.constructor.apply(this, arguments);
    }

    CustomFieldFilter.prototype.defaults = {
        operator: '=',
        type: 'CHAR'
    };

    return CustomFieldFilter;

})(Backbone.Model);

CustomFieldFilterCollection = (function(_super) {
    __extends(CustomFieldFilterCollection, _super);

    function CustomFieldFilterCollection() {
        return CustomFieldFilterCollection.__super__.constructor.apply(this, arguments);
    }

    CustomFieldFilterCollection.prototype.model = CustomFieldFilter;

    return CustomFieldFilterCollection;

})(CollectionBase);

AutoModeSettings = (function(_super) {
    __extends(AutoModeSettings, _super);

    function AutoModeSettings() {
        return AutoModeSettings.__super__.constructor.apply(this, arguments);
    }

    AutoModeSettings.prototype.defaults = {
        choose_template_method: 'sequential',
        taxonomy_filters_relation: 'AND',
        custom_field_filters_relation: 'AND'
    };

    AutoModeSettings.prototype.nested = {
        taxonomyFilters: TaxonomyFilterCollection,
        customFieldFilters: CustomFieldFilterCollection,
        cellTemplates: CellTemplateCollection
    };

    return AutoModeSettings;

})(NestedModel);

Font = (function(_super) {
    __extends(Font, _super);

    function Font() {
        return Font.__super__.constructor.apply(this, arguments);
    }

    Font.prototype.defaults = {
        font: '',
        style: 'regular'
    };

    return Font;

})(Backbone.Model);

FontSettings = (function(_super) {
    __extends(FontSettings, _super);

    function FontSettings() {
        return FontSettings.__super__.constructor.apply(this, arguments);
    }

    FontSettings.prototype.nested = {
        title: Font,
        tagline: Font,
        hover_title: Font,
        hover_text: Font,
        lightbox_title: Font,
        lightbox_text: Font,
        label_title: Font,
        label_tagline: Font,
        label_price: Font,
        filters: Font,
        pagination: Font
    };

    return FontSettings;

})(NestedModel);

FontCollection = (function(_super) {
    __extends(FontCollection, _super);

    function FontCollection() {
        return FontCollection.__super__.constructor.apply(this, arguments);
    }

    FontCollection.prototype.url = "admin-ajax.php?action=uber_grid_get_fonts";

    FontCollection.prototype.parse = function(data) {
        return data.items;
    };

    return FontCollection;

})(Backbone.Collection);

LayoutModeSettings = (function(_super) {
    __extends(LayoutModeSettings, _super);

    function LayoutModeSettings() {
        return LayoutModeSettings.__super__.constructor.apply(this, arguments);
    }

    return LayoutModeSettings;

})(NestedModel);

LayoutSettings = (function(_super) {
    __extends(LayoutSettings, _super);

    function LayoutSettings() {
        return LayoutSettings.__super__.constructor.apply(this, arguments);
    }

    LayoutSettings.prototype.nested = {
        "default": LayoutModeSettings,
        '440': LayoutModeSettings,
        '768': LayoutModeSettings
    };

    return LayoutSettings;

})(NestedModel);

PaginationSettings = (function(_super) {
    __extends(PaginationSettings, _super);

    function PaginationSettings() {
        return PaginationSettings.__super__.constructor.apply(this, arguments);
    }

    PaginationSettings.prototype.isPagination = function() {
        return this.get('style') === 'pagination';
    };

    return PaginationSettings;

})(Backbone.Model);

GridEditorModel = (function(_super) {
    __extends(GridEditorModel, _super);

    function GridEditorModel() {
        return GridEditorModel.__super__.constructor.apply(this, arguments);
    }

    GridEditorModel.prototype.nested = {
        cells: CellCollection,
        auto: AutoModeSettings,
        fonts: FontSettings,
        layout: LayoutSettings,
        filters: Backbone.Model,
        pagination: PaginationSettings,
        effects: Backbone.Model
    };

    return GridEditorModel;

})(NestedModel);

var FontsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

FontsView = (function(_super) {
    __extends(FontsView, _super);

    function FontsView() {
        return FontsView.__super__.constructor.apply(this, arguments);
    }

    FontsView.prototype.ui = {
        fontSelectors: 'select[role=font]',
        fontVariantSelectors: 'select[role=style]',
        spinner: '.spin-wrapper',
        content: '#fonts'
    };

    FontsView.prototype.initialize = function() {
        FontsView.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        this.fonts = new FontCollection;
        this.listenTo(this.fonts, 'sync', this.onFontsSync);
        return this.fonts.fetch();
    };

    FontsView.prototype.onFontsSync = function(param) {
        var font, _i, _len, _ref;
        _ref = this.fonts.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            font = _ref[_i];
            this.ui.fontSelectors.append(jQuery("<option />").text(font.get('family')));
        }
        this.ui.spinner.remove();
        this.ui.content.css('visibility', 'visible');
        return this.bind();
    };

    FontsView.prototype.bind = function() {
        return this.binding = rivets.bind(this.$el, this.model, {
            components: {
                fonts: this.fonts
            }
        });
    };

    return FontsView;

})(Marionette.ItemView);

var ImageSelector,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

ImageSelector = (function(_super) {
    __extends(ImageSelector, _super);

    function ImageSelector() {
        this.loadNewImageById = __bind(this.loadNewImageById, this);
        this.loadNewImage = __bind(this.loadNewImage, this);
        this.onLayoutChanged = __bind(this.onLayoutChanged, this);
        this.setImageField = __bind(this.setImageField, this);
        this.onImageDeleteClicked = __bind(this.onImageDeleteClicked, this);
        this.onImageSelectClicked = __bind(this.onImageSelectClicked, this);
        this.onImageChanged = __bind(this.onImageChanged, this);
        this.onMouseOut = __bind(this.onMouseOut, this);
        this.onMouseEnter = __bind(this.onMouseEnter, this);
        return ImageSelector.__super__.constructor.apply(this, arguments);
    }

    ImageSelector.prototype.ui = {
        input: 'input',
        image: 'img',
        actions: '.actions-wrapper',
        overlay: '.overlay',
        select: '.select-image',
        remove: '.image-delete'
    };

    ImageSelector.prototype.events = {
        'click button.select-image': 'onImageSelectClicked',
        'click a.image-delete': 'onImageDeleteClicked',
        mouseenter: 'onMouseEnter',
        mouseleave: 'onMouseOut'
    };

    ImageSelector.prototype.modelEvents = {
        'change:layout': 'onLayoutChanged'
    };

    ImageSelector.prototype.initialize = function() {
        ImageSelector.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        return this.onImageChanged();
    };

    ImageSelector.prototype.bindUIElements = function() {
        ImageSelector.__super__.bindUIElements.apply(this, arguments);
        this.ui.image.hide();
        if (this.ui.input.val()) {
            this.model.loadImage(this.getOption('imageProperty'));
            this.ui.select.hide();
            this.ui.remove.show();
            this.ui.overlay.show();
        } else {
            this.ui.select.show();
            this.ui.remove.hide();
            this.ui.overlay.hide();
        }
        return this.listenTo(this.model, "change:" + (this.getOption('imageProperty')), this.onImageChanged);
    };

    ImageSelector.prototype.onMouseEnter = function() {
        if (this.model.get(this.getOption('imageProperty'))) {
            this.ui.actions.fadeIn('fast');
            return this.ui.overlay.fadeIn('fast');
        }
    };

    ImageSelector.prototype.onMouseOut = function() {
        if (this.model.get(this.getOption('imageProperty'))) {
            this.ui.actions.fadeOut('fast');
            return this.ui.overlay.fadeOut('fast');
        }
    };

    ImageSelector.prototype.onImageChanged = function() {
        var image;
        if (image = this.model.get(this.getOption('imageProperty'))) {
            return this.loadNewImageById(image);
        }
    };

    ImageSelector.prototype.onImageSelectClicked = function(event) {
        var flow, id, selector, state;
        selector = this;
        event.preventDefault();
        id = selector.ui.input.val();
        flow = wp.media({
            title: "Select an image",
            library: {
                type: 'image'
            },
            button: {
                text: "Select Image"
            },
            multiple: false
        }).open();
        state = flow.state();
        if ('' !== id && -1 !== id) {
            state.get('selection').reset([wp.media.model.Attachment.get(id)]);
        }
        state.set('display', false);
        return state.on('select', function(el) {
            var selection;
            selection = this.get('selection').single();
            selector.setImageField(selection.id);
            return selector.loadNewImageById(selection.id);
        });
    };

    ImageSelector.prototype.onImageDeleteClicked = function(event) {
        event.preventDefault();
        this.ui.input.val('');
        this.model.set(this.getOption('imageProperty'), null);
        this.ui.image.hide().attr('src', '');
        this.ui.overlay.hide();
        this.ui.select.fadeIn('fast');
        this.ui.actions.show();
        return this.ui.remove.hide();
    };

    ImageSelector.prototype.layouts = {
        "r1c1-io": "r1c1",
        "r1c2-ir": "r1c1",
        "r1c2-il": "r1c1",
        "r2c1-it": "r1c1",
        "r2c1-ib": "r1c1",
        "r2c2-io": "r2c2",
        "r2c2-it": "r1c2",
        "r2c2-ib": "r1c2",
        "r2c2-il": "r2c1",
        "r2c2-ir": "r2c1",
        "r1c2-io": "r1c2",
        "r2c1-io": "r2c1"
    };

    ImageSelector.prototype.setImageField = function(selection) {
        this.ui.input.val(selection);
        return this.model.set(this.getOption('imageProperty'), selection);
    };

    ImageSelector.prototype.onLayoutChanged = function() {
        var image;
        if (image = this.model.get(this.getOption('imageProperty'))) {
            return this.loadNewImageById(image);
        }
    };

    ImageSelector.prototype.loadNewImage = function(url) {
        this.ui.image.attr('src', url).show();
        this.$el.find('.image-delete').fadeIn('fast');
        this.$el.find('.actions-wrapper, .overlay').fadeOut('fast');
        return false;
    };

    ImageSelector.prototype.loadNewImageById = function(id) {
        var layout;
        if (this.getOption('obeyLayout')) {
            layout = this.layouts[this.model.get('layout')];
        } else {
            layout = 'thumbnail';
        }
        return jQuery.post('admin-ajax.php?action=uber_grid_reload_images', {
            ids: id,
            layout: layout
        }, (function(_this) {
            return function(response) {
                return _this.loadNewImage(response.srcs[0]);
            };
        })(this));
    };

    return ImageSelector;

})(Marionette.ItemView);

var LayoutSelector,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

LayoutSelector = (function(_super) {
    __extends(LayoutSelector, _super);

    function LayoutSelector() {
        this.onLayoutChanged = __bind(this.onLayoutChanged, this);
        return LayoutSelector.__super__.constructor.apply(this, arguments);
    }

    LayoutSelector.prototype.ui = {
        options: 'li',
        input: 'input'
    };

    LayoutSelector.prototype.events = {
        'click @ui.options': 'onLayoutChanged'
    };

    LayoutSelector.prototype.initialize = function() {
        LayoutSelector.__super__.initialize.apply(this, arguments);
        return this.bindUIElements();
    };

    LayoutSelector.prototype.bindUIElements = function() {
        var layout;
        LayoutSelector.__super__.bindUIElements.apply(this, arguments);
        if ((layout = this.model.get('layout'))) {
            return this.$el.find("li." + layout).addClass("selected");
        }
    };

    LayoutSelector.prototype.onLayoutChanged = function(event) {
        var clicked;
        clicked = jQuery(event.target).parent();
        this.ui.options.removeClass("selected");
        clicked.addClass("selected");
        return this.model.set('layout', clicked.attr("class").split(/\s+/)[0]);
    };

    return LayoutSelector;

})(Marionette.ItemView);

var CellEditorSectionView,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

CellEditorSectionView = (function(_super) {
    __extends(CellEditorSectionView, _super);

    function CellEditorSectionView() {
        this.onHeaderLabelClicked = __bind(this.onHeaderLabelClicked, this);
        this.onHeaderCheckboxClicked = __bind(this.onHeaderCheckboxClicked, this);
        return CellEditorSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorSectionView.prototype.ui = function() {
        return {
            header: 'label.huge',
            headerCheckbox: 'label.huge :checkbox',
            imageSelectors: '.image-selector',
            columns: '.ug-columns-2, .ug-column-1',
            colorPickers: '.color-picker'
        };
    };

    CellEditorSectionView.prototype.events = function() {
        return {
            'change @ui.headerCheckbox': 'onHeaderCheckboxClicked',
            'click @ui.header': 'onHeaderLabelClicked'
        };
    };

    CellEditorSectionView.prototype.className = function() {
        return 'ug-section ug-expandable';
    };

    CellEditorSectionView.prototype.initialize = function() {
        CellEditorSectionView.__super__.initialize.apply(this, arguments);
        if (this.model) {
            return this.listenTo(this.model, "change:" + (this.getOption('visibilityProperty')), this.onHeaderLabelClicked);
        }
    };

    CellEditorSectionView.prototype.bindUIElements = function() {
        var visibilityProperty;
        CellEditorSectionView.__super__.bindUIElements.apply(this, arguments);
        if (visibilityProperty = this.getOption('visibilityProperty')) {
            if (this.model.get(visibilityProperty)) {
                this.$el.addClass('ug-expanded');
            }
        }
        return this.ui.colorPickers.wpColorPicker();
    };

    CellEditorSectionView.prototype.onHeaderCheckboxClicked = function(e) {};

    CellEditorSectionView.prototype.onHeaderLabelClicked = function(e) {
        if (this.$el.hasClass('ug-expandable') && this.ui.headerCheckbox.length > 0) {
            return this.$el.toggleClass('ug-expanded');
        } else {
            return this.$el.toggleClass('ug-expanded');
        }
    };

    return CellEditorSectionView;

})(Marionette.LayoutView);

var CellEditorBase,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

CellEditorBase = (function(_super) {
    __extends(CellEditorBase, _super);

    function CellEditorBase() {
        this.onRemoveClicked = __bind(this.onRemoveClicked, this);
        this.onCloneClicked = __bind(this.onCloneClicked, this);
        return CellEditorBase.__super__.constructor.apply(this, arguments);
    }

    CellEditorBase.prototype.className = 'ug-cell';

    CellEditorBase.prototype.tagName = 'li';

    CellEditorBase.prototype.regions = function() {
        return {
            main: '.ug-cell-main-wrapper',
            filtering: '.ug-cell-filtering-wrapper',
            layout: '.ug-cell-layout-wrapper',
            linking: '.ug-cell-linking-wrapper',
            hover: '.ug-cell-hover-wrapper',
            label: '.ug-cell-label-wrapper'
        };
    };

    CellEditorBase.prototype.className = 'ug-cell';

    CellEditorBase.prototype.ui = function() {
        return {
            header: '> h3',
            headerText: 'h3 .heading',
            cloneLink: '> h3 a[data-action=clone]',
            removeLink: '> h3 a[data-action=remove]'
        };
    };

    CellEditorBase.prototype.events = {
        'click @ui.header': 'onHeaderClicked',
        'click @ui.cloneLink': 'onCloneClicked',
        'click @ui.removeLink': 'onRemoveClicked'
    };

    CellEditorBase.prototype.onCloneClicked = function(e) {
        e.stopPropagation();
        e.preventDefault();
        return this.model.clone();
    };

    CellEditorBase.prototype.onRemoveClicked = function(e) {
        e.preventDefault();
        return this.model.collection.remove(this.model);
    };

    CellEditorBase.prototype.onHeaderClicked = function() {
        this.$el.toggleClass('ug-expanded');
        if (this.$el.hasClass('ug-expanded')) {
            return this.displaySections();
        } else {
            return this.hideSections();
        }
    };

    CellEditorBase.prototype.scrollTo = function() {
        return this.$el.scrollTo();
    };

    return CellEditorBase;

})(Marionette.LayoutView);

var CellEditorHoverSectionView, CellEditorLabelSectionView, CellEditorLayoutSectionView, CellEditorLinkingSectionView, CellEditorMainSectionView, CellTemplateMainSectionView, LightboxLinkingOptions, LinkingOptions,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

CellEditorMainSectionView = (function(_super) {
    __extends(CellEditorMainSectionView, _super);

    function CellEditorMainSectionView() {
        return CellEditorMainSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorMainSectionView.prototype.template = '#ug-cell-main-section-template';

    CellEditorMainSectionView.prototype.className = function() {
        return 'ug-section cell-title';
    };

    CellEditorMainSectionView.prototype.ui = function() {
        return _.extend(CellEditorMainSectionView.__super__.ui.apply(this, arguments), {
            titleEditor: 'input.ug-cell-title',
            mainImageSelector: '.ug-main-image-selector',
            backgroundImageSelector: '.ug-background-image-selector'
        });
    };

    CellEditorMainSectionView.prototype.bindUIElements = function() {
        CellEditorMainSectionView.__super__.bindUIElements.apply(this, arguments);
        this.mainImageSelector = new ImageSelector({
            el: this.ui.mainImageSelector,
            model: this.model,
            imageProperty: 'image',
            obeyLayout: true
        });
        return this.backgroundImageSelector = new ImageSelector({
            el: this.ui.backgroundImageSelector,
            model: this.model,
            imageProperty: 'background_image',
            obeyLayout: true
        });
    };

    return CellEditorMainSectionView;

})(CellEditorSectionView);

CellTemplateMainSectionView = (function(_super) {
    __extends(CellTemplateMainSectionView, _super);

    function CellTemplateMainSectionView() {
        return CellTemplateMainSectionView.__super__.constructor.apply(this, arguments);
    }

    return CellTemplateMainSectionView;

})(CellEditorMainSectionView);

CellEditorLayoutSectionView = (function(_super) {
    __extends(CellEditorLayoutSectionView, _super);

    function CellEditorLayoutSectionView() {
        return CellEditorLayoutSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorLayoutSectionView.prototype.template = '#ug-cell-section-layout-template';

    CellEditorLayoutSectionView.prototype.className = function() {
        return CellEditorLayoutSectionView.__super__.className.apply(this, arguments) + ' cell-layout';
    };

    CellEditorLayoutSectionView.prototype.ui = function() {
        return _.extend(CellEditorLayoutSectionView.__super__.ui.apply(this, arguments), {
            lightboxImageSelector: '.image-selector',
            layouts: '.ug-layouts'
        });
    };

    CellEditorLayoutSectionView.prototype.initialize = function() {
        return CellEditorLayoutSectionView.__super__.initialize.apply(this, arguments);
    };

    CellEditorLayoutSectionView.prototype.bindUIElements = function() {
        CellEditorLayoutSectionView.__super__.bindUIElements.apply(this, arguments);
        return this.layoutSelector = new LayoutSelector({
            el: this.ui.layouts,
            model: this.model
        });
    };

    return CellEditorLayoutSectionView;

})(CellEditorSectionView);

CellEditorLinkingSectionView = (function(_super) {
    __extends(CellEditorLinkingSectionView, _super);

    function CellEditorLinkingSectionView() {
        this.onLinkModeChanged = __bind(this.onLinkModeChanged, this);
        this.onShow = __bind(this.onShow, this);
        return CellEditorLinkingSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorLinkingSectionView.prototype.template = '#ug-cell-section-link-mode-template';

    CellEditorLinkingSectionView.prototype.className = 'ug-section ug-expandable ug-cell-link';

    CellEditorLinkingSectionView.prototype.regions = {
        details: '.ug-linking-details'
    };

    CellEditorLinkingSectionView.prototype.ui = function() {
        return _.extend(CellEditorLinkingSectionView.__super__.ui.apply(this, arguments), {
            lightboxImageSelector: '.image-selector'
        });
    };

    CellEditorLinkingSectionView.prototype.modelEvents = {
        'change:mode': 'onLinkModeChanged'
    };

    CellEditorLinkingSectionView.prototype.visibilityProperty = 'enable';

    CellEditorLinkingSectionView.prototype.onShow = function() {
        return this.onLinkModeChanged();
    };

    CellEditorLinkingSectionView.prototype.onLinkModeChanged = function() {
        this.details.show(this.getLinkingModeView());
        if (this.binding) {
            this.binding.unbind();
        }
        console.info(this.model);
        return this.binding = rivets.bind(this.$el, this.model);
    };

    CellEditorLinkingSectionView.prototype.getLinkingModeView = function() {
        if (this.model.get('mode') === 'lightbox') {
            return new LightboxLinkingOptions({
                model: this.model.get('lightbox')
            });
        } else {
            return new LinkingOptions({
                model: this.model
            });
        }
    };

    CellEditorLinkingSectionView.prototype.remove = function() {
        if (this.binding) {
            this.binding.unbind();
        }
        return CellEditorLinkingSectionView.__super__.remove.apply(this, arguments);
    };

    return CellEditorLinkingSectionView;

})(CellEditorSectionView);

LightboxLinkingOptions = (function(_super) {
    __extends(LightboxLinkingOptions, _super);

    function LightboxLinkingOptions() {
        return LightboxLinkingOptions.__super__.constructor.apply(this, arguments);
    }

    LightboxLinkingOptions.prototype.template = '#ug-cell-linking-lightbox-template';

    LightboxLinkingOptions.prototype.ui = {
        imageSelector: '.image-selector'
    };

    LightboxLinkingOptions.prototype.onShow = function() {
        return this.lightboxImageSelector = new ImageSelector({
            el: this.ui.imageSelector,
            model: this.model,
            imageProperty: 'image'
        });
    };

    LightboxLinkingOptions.prototype.remove = function() {
        this.lightboxImageSelector.remove();
        return LightboxLinkingOptions.__super__.remove.apply(this, arguments);
    };

    return LightboxLinkingOptions;

})(Marionette.ItemView);

LinkingOptions = (function(_super) {
    __extends(LinkingOptions, _super);

    function LinkingOptions() {
        return LinkingOptions.__super__.constructor.apply(this, arguments);
    }

    LinkingOptions.prototype.template = '#ug-cell-linking-url';

    return LinkingOptions;

})(Marionette.ItemView);

CellEditorHoverSectionView = (function(_super) {
    __extends(CellEditorHoverSectionView, _super);

    function CellEditorHoverSectionView() {
        return CellEditorHoverSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorHoverSectionView.prototype.template = '#ug-cell-section-hover-template';

    CellEditorHoverSectionView.prototype.className = 'ug-section ug-expandable ug-cell-hover';

    CellEditorHoverSectionView.prototype.ui = function() {
        return _.extend(CellEditorHoverSectionView.__super__.ui.apply(this, arguments), {
            hoverImageSelector: '.image-selector'
        });
    };

    CellEditorHoverSectionView.prototype.visibilityProperty = 'enable';

    CellEditorHoverSectionView.prototype.onShow = function() {
        return this.hoverImageSelector = new ImageSelector({
            el: this.ui.hoverImageSelector,
            model: this.model,
            imageProperty: 'background_image',
            obeyLayout: false
        });
    };

    return CellEditorHoverSectionView;

})(CellEditorSectionView);

CellEditorLabelSectionView = (function(_super) {
    __extends(CellEditorLabelSectionView, _super);

    function CellEditorLabelSectionView() {
        return CellEditorLabelSectionView.__super__.constructor.apply(this, arguments);
    }

    CellEditorLabelSectionView.prototype.template = '#ug-cell-section-label-template';

    CellEditorLabelSectionView.prototype.className = 'ug-section ug-expandable ug-cell-label';

    CellEditorLabelSectionView.prototype.visibilityProperty = 'enable';

    return CellEditorLabelSectionView;

})(CellEditorSectionView);

var CellEditorView, EmptyManualEditorView, ManualEditorView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

EmptyManualEditorView = (function(_super) {
    __extends(EmptyManualEditorView, _super);

    function EmptyManualEditorView() {
        return EmptyManualEditorView.__super__.constructor.apply(this, arguments);
    }

    EmptyManualEditorView.prototype.template = '#ug-manual-editor-no-cells-template';

    EmptyManualEditorView.prototype.tagName = 'li';

    EmptyManualEditorView.prototype.className = 'ug-no-cells';

    return EmptyManualEditorView;

})(Marionette.ItemView);

CellEditorView = (function(_super) {
    __extends(CellEditorView, _super);

    function CellEditorView() {
        this.onTitleChanged = __bind(this.onTitleChanged, this);
        return CellEditorView.__super__.constructor.apply(this, arguments);
    }

    CellEditorView.prototype.template = '#ug-cell-manual-template';

    CellEditorView.prototype.modelEvents = {
        'change:title': 'onTitleChanged'
    };

    CellEditorView.prototype.onShow = function() {
        return this.onTitleChanged();
    };

    CellEditorView.prototype.displaySections = function() {
        this.main.show(new CellEditorMainSectionView({
            model: this.model
        }));
        this.filtering.show(new CellEditorSectionView({
            model: this.model,
            className: 'ug-section ug-expandable',
            template: '#ug-cell-filtering-section-template'
        }));
        this.layout.show(new CellEditorLayoutSectionView({
            model: this.model
        }));
        this.hover.show(new CellEditorHoverSectionView({
            model: this.model.get('hover')
        }));
        this.label.show(new CellEditorLabelSectionView({
            model: this.model.get('label')
        }));
        this.binding = rivets.bind(this.$el, {
            model: this.model
        });
        return this.linking.show(new CellEditorLinkingSectionView({
            model: this.model.get('link')
        }));
    };

    CellEditorView.prototype.hideSections = function() {
        var region, _i, _len, _ref, _results;
        this.binding.unbind();
        _ref = [this.main, this.filtering, this.layout, this.linking, this.hover, this.label];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            region = _ref[_i];
            _results.push(region.empty());
        }
        return _results;
    };

    CellEditorView.prototype.onTitleChanged = function() {
        var i, text;
        if (!(text = this.model.get('title'))) {
            i = this.model.collection.indexOf(this.model) + 1;
            text = "Cell " + i;
        }
        return this.ui.headerText.html(text);
    };

    return CellEditorView;

})(CellEditorBase);

ManualEditorView = (function(_super) {
    __extends(ManualEditorView, _super);

    function ManualEditorView() {
        this.onAddCellAfterClicked = __bind(this.onAddCellAfterClicked, this);
        this.onAddCellBeforeClicked = __bind(this.onAddCellBeforeClicked, this);
        this.onSorted = __bind(this.onSorted, this);
        return ManualEditorView.__super__.constructor.apply(this, arguments);
    }

    ManualEditorView.prototype.template = '#ug-manual-editor-template';

    ManualEditorView.prototype.childViewContainer = '> ul';

    ManualEditorView.prototype.childView = CellEditorView;

    ManualEditorView.prototype.emptyView = EmptyManualEditorView;

    ManualEditorView.prototype.ui = function() {
        return {
            addCellBefore: 'button[data-action=add-new-before]',
            addCellAfter: 'button[data-action=add-new-after]',
            children: '>ul'
        };
    };

    ManualEditorView.prototype.events = {
        'click @ui.addCellBefore': 'onAddCellBeforeClicked',
        'click @ui.addCellAfter': 'onAddCellAfterClicked'
    };

    ManualEditorView.prototype.bindUIElements = function() {
        ManualEditorView.__super__.bindUIElements.apply(this, arguments);
        return this.ui.children.sortable({
            axis: 'y',
            update: this.onSorted
        });
    };

    ManualEditorView.prototype.onSorted = function(event, ui) {
        var child, index, item;
        item = ui.item[0];
        child = this.children.find((function(_this) {
            return function(child) {
                return item === child.el;
            };
        })(this));
        index = this.ui.children.find('> li').index(child.$el);
        this.collection.remove(child.model);
        return this.collection.add(child.model, {
            at: index
        });
    };

    ManualEditorView.prototype.onAddCellBeforeClicked = function(event) {
        var cell;
        event.preventDefault();
        this.collection.add(cell = new Cell, {
            at: 0
        });
        return this.children.findByModel(cell).scrollTo();
    };

    ManualEditorView.prototype.onAddCellAfterClicked = function(event) {
        var cell;
        event.preventDefault();
        this.collection.add(cell = new Cell);
        return this.children.findByModel(cell).scrollTo();
    };

    return ManualEditorView;

})(Marionette.CompositeView);

var AutoCategoriesView, AutoEditorQueryView, AutomaticEditorView, CellTemplateView, CellTemplatesView, CustomFieldFilterView, CustomFieldFiltersView, FilterView, FiltersView, TaxonomyFilterView, TaxonomyFiltersView,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

FiltersView = (function(_super) {
    __extends(FiltersView, _super);

    function FiltersView() {
        this.onAddClicked = __bind(this.onAddClicked, this);
        return FiltersView.__super__.constructor.apply(this, arguments);
    }

    FiltersView.prototype.ui = {
        addButton: 'button[data-action=add]'
    };

    FiltersView.prototype.events = {
        'click @ui.addButton': 'onAddClicked'
    };

    FiltersView.prototype.childViewContainer = 'ul';

    FiltersView.prototype.onShow = function() {
        console.info(this.model);
        return this.binding = rivets.bind(this.$el, this.model);
    };

    FiltersView.prototype.onAddClicked = function(e) {
        e.preventDefault();
        return this.collection.add({});
    };

    return FiltersView;

})(Marionette.CompositeView);

FilterView = (function(_super) {
    __extends(FilterView, _super);

    function FilterView() {
        return FilterView.__super__.constructor.apply(this, arguments);
    }

    FilterView.prototype.tagName = 'li';

    FilterView.prototype.ui = function() {
        return {
            'button': 'button'
        };
    };

    FilterView.prototype.events = {
        'click @ui.button': 'onRemoveClicked'
    };

    FilterView.prototype.onShow = function() {
        return this.binding = rivets.bind(this.$el, {
            model: this.model
        });
    };

    FilterView.prototype.onRemoveClicked = function() {
        return this.model.collection.remove(this.model);
    };

    return FilterView;

})(Marionette.ItemView);

TaxonomyFilterView = (function(_super) {
    __extends(TaxonomyFilterView, _super);

    function TaxonomyFilterView() {
        return TaxonomyFilterView.__super__.constructor.apply(this, arguments);
    }

    TaxonomyFilterView.prototype.template = '#ug-taxonomy-filter-template';

    TaxonomyFilterView.prototype.ui = function() {
        return _.extend(TaxonomyFilterView.__super__.ui.apply(this, arguments), {
            taxonomySelect: 'select[role=taxonomy]'
        });
    };

    TaxonomyFilterView.prototype.onShow = function() {
        TaxonomyFilterView.__super__.onShow.apply(this, arguments);
        if (!this.model.get('taxonomy')) {
            return this.model.set('taxonomy', this.ui.taxonomySelect.find('option:first-child').attr('value'));
        }
    };

    return TaxonomyFilterView;

})(FilterView);

TaxonomyFiltersView = (function(_super) {
    __extends(TaxonomyFiltersView, _super);

    function TaxonomyFiltersView() {
        return TaxonomyFiltersView.__super__.constructor.apply(this, arguments);
    }

    TaxonomyFiltersView.prototype.template = '#ug-taxonomy-filters-template';

    TaxonomyFiltersView.prototype.childView = TaxonomyFilterView;

    return TaxonomyFiltersView;

})(FiltersView);

CustomFieldFilterView = (function(_super) {
    __extends(CustomFieldFilterView, _super);

    function CustomFieldFilterView() {
        return CustomFieldFilterView.__super__.constructor.apply(this, arguments);
    }

    CustomFieldFilterView.prototype.template = '#ug-custom-fields-filter-template';

    CustomFieldFilterView.prototype.ui = function() {
        return _.extend(CustomFieldFilterView.__super__.ui.apply(this, arguments), {
            keySelect: 'select[role=key]'
        });
    };

    CustomFieldFilterView.prototype.onShow = function() {
        CustomFieldFilterView.__super__.onShow.apply(this, arguments);
        if (!this.model.get('key')) {
            return this.model.set('key', this.ui.keySelect.find('option:first-child').attr('value'));
        }
    };

    return CustomFieldFilterView;

})(FilterView);

CustomFieldFiltersView = (function(_super) {
    __extends(CustomFieldFiltersView, _super);

    function CustomFieldFiltersView() {
        return CustomFieldFiltersView.__super__.constructor.apply(this, arguments);
    }

    CustomFieldFiltersView.prototype.template = '#ug-custom-fields-filters-template';

    CustomFieldFiltersView.prototype.childView = CustomFieldFilterView;

    return CustomFieldFiltersView;

})(FiltersView);

CellTemplateView = (function(_super) {
    __extends(CellTemplateView, _super);

    function CellTemplateView() {
        this.onCollectionChange = __bind(this.onCollectionChange, this);
        return CellTemplateView.__super__.constructor.apply(this, arguments);
    }

    CellTemplateView.prototype.template = '#ug-auto-cell-template-template';

    CellTemplateView.prototype.regions = function() {
        return _.extend(CellTemplateView.__super__.regions.apply(this, arguments), {
            legend: '.ug-cell-legend-wrapper',
            application: '.ug-cell-application-wrapper'
        });
    };

    CellTemplateView.prototype.ui = function() {
        return _.extend(CellTemplateView.__super__.ui.apply(this, arguments), {
            application: '.ug-cell-application-wrapper'
        });
    };

    CellTemplateView.prototype.initialize = function() {
        this.listenTo(this.model.collection, 'remove', this.onCollectionChange);
        this.listenTo(this.model.collection, 'add', this.onCollectionChange);
        return this.listenTo(this.getOption('ownerModel'), 'change:choose_template_method', this.onTemplateSelectionMethodChanged);
    };

    CellTemplateView.prototype.onCollectionChange = function() {
        if (this.model.collection.length === 1) {
            if (this.ui.removeLink.hide) {
                return this.ui.removeLink.hide();
            }
        } else {
            if (this.ui.removeLink.show) {
                return this.ui.removeLink.show();
            }
        }
    };

    CellTemplateView.prototype.onTemplateSelectionMethodChanged = function() {
        var method, params;
        params = {
            model: this.model,
            className: 'ug-section ug-expandable'
        };
        method = this.getOption('ownerModel').get('choose_template_method');
        switch (method) {
            case 'php':
                this.ui.application.show();
                return this.application.show(new CellEditorSectionView(_.extend(params, {
                    template: '#ug-auto-cell-template-php-application-mode'
                })));
            case 'taxonomy':
                this.ui.application.show();
                return this.application.show(new CellEditorSectionView(_.extend(params, {
                    template: '#ug-auto-cell-template-taxonomy-application-mode'
                })));
            default:
                this.ui.application.hide();
                return this.application.empty();
        }
    };

    CellTemplateView.prototype.onShow = function() {
        return this.onCollectionChange();
    };

    CellTemplateView.prototype.displaySections = function() {
        this.legend.show(new CellEditorSectionView({
            template: '#ug-auto-cell-template-legend-section-template',
            className: 'ug-section ug-expandable'
        }));
        this.onTemplateSelectionMethodChanged();
        this.main.show(new CellTemplateMainSectionView({
            model: this.model,
            className: 'ug-section ug-expandable'
        }));
        this.layout.show(new CellEditorLayoutSectionView({
            model: this.model,
            className: 'ug-section ug-expandable'
        }));
        this.hover.show(new CellEditorHoverSectionView({
            model: this.model.get('hover')
        }));
        this.label.show(new CellEditorLabelSectionView({
            model: this.model.get('label')
        }));
        this.binding = rivets.bind(this.$el, {
            model: this.model
        });
        return this.linking.show(new CellEditorLinkingSectionView({
            model: this.model.get('link')
        }));
    };

    CellTemplateView.prototype.hideSections = function() {
        var region, _i, _len, _ref, _results;
        this.binding.unbind();
        _ref = [this.legend, this.main, this.layout, this.linking, this.hover, this.label];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            region = _ref[_i];
            _results.push(region.empty());
        }
        return _results;
    };

    return CellTemplateView;

})(CellEditorBase);

CellTemplatesView = (function(_super) {
    __extends(CellTemplatesView, _super);

    function CellTemplatesView() {
        this.onAddCellClicked = __bind(this.onAddCellClicked, this);
        this.childViewOptions = __bind(this.childViewOptions, this);
        return CellTemplatesView.__super__.constructor.apply(this, arguments);
    }

    CellTemplatesView.prototype.template = '#ug-auto-cell-templates-wrapper-template';

    CellTemplatesView.prototype.childView = CellTemplateView;

    CellTemplatesView.prototype.ui = function() {
        return _.extend(CellTemplatesView.__super__.ui.apply(this, arguments), {
            header: '.cells-header'
        });
    };

    CellTemplatesView.prototype.childViewOptions = function(child, index) {
        return {
            ownerModel: this.model
        };
    };

    CellTemplatesView.prototype.onAddCellClicked = function(event) {
        var cell;
        event.preventDefault();
        this.collection.add(cell = new CellTemplate);
        return this.children.findByModel(cell).scrollTo();
    };

    CellTemplatesView.prototype.onShow = function() {
        return this.binding = rivets.bind(this.ui.header, this.model);
    };

    return CellTemplatesView;

})(ManualEditorView);

AutoEditorQueryView = (function(_super) {
    __extends(AutoEditorQueryView, _super);

    function AutoEditorQueryView() {
        return AutoEditorQueryView.__super__.constructor.apply(this, arguments);
    }

    AutoEditorQueryView.prototype.id = 'auto-post-settings';

    AutoEditorQueryView.prototype.template = "#ug-auto-mode-query-template";

    AutoEditorQueryView.prototype.className = 'ug-cell';

    AutoEditorQueryView.prototype.regions = {
        taxonomyFilters: '.ug-taxonomy-filters-wrapper',
        customFieldFilters: '.ug-custom-field-filters-wrapper'
    };

    AutoEditorQueryView.prototype.onShow = function() {
        this.binding = rivets.bind(this.$el, {
            model: this.model
        });
        this.taxonomyFilters.show(new TaxonomyFiltersView({
            collection: this.model.get('taxonomyFilters'),
            model: this.model
        }));
        return this.customFieldFilters.show(new CustomFieldFiltersView({
            collection: this.model.get('customFieldFilters'),
            model: this.model
        }));
    };

    return AutoEditorQueryView;

})(Marionette.LayoutView);

AutoCategoriesView = (function(_super) {
    __extends(AutoCategoriesView, _super);

    function AutoCategoriesView() {
        return AutoCategoriesView.__super__.constructor.apply(this, arguments);
    }

    AutoCategoriesView.prototype.template = '#ug-auto-mode-filters-source';

    AutoCategoriesView.prototype.className = 'ug-cell';

    AutoCategoriesView.prototype.onAttach = function() {
        return this.binding = rivets.bind(this.$el, this.model);
    };

    return AutoCategoriesView;

})(Marionette.ItemView);

AutomaticEditorView = (function(_super) {
    __extends(AutomaticEditorView, _super);

    function AutomaticEditorView() {
        return AutomaticEditorView.__super__.constructor.apply(this, arguments);
    }

    AutomaticEditorView.prototype.template = '#auto-mode-template';

    AutomaticEditorView.prototype.regions = {
        query: '.ug-post-query-wrapper',
        categories: '.ug-categories-wrapper',
        cellTemplate: '.ug-cell-template'
    };

    AutomaticEditorView.prototype.onShow = function() {
        this.query.show(new AutoEditorQueryView({
            model: this.model
        }));
        this.categories.show(new AutoCategoriesView({
            model: this.model
        }));
        return this.cellTemplate.show(new CellTemplatesView({
            collection: this.model.get('cellTemplates'),
            model: this.model
        }));
    };

    return AutomaticEditorView;

})(Marionette.LayoutView);

var ExtraTabsView, LayoutTabsView, TabsView,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

TabsView = (function(_super) {
    __extends(TabsView, _super);

    function TabsView() {
        this.onLinkClicked = __bind(this.onLinkClicked, this);
        return TabsView.__super__.constructor.apply(this, arguments);
    }

    TabsView.prototype.ui = function() {
        return {
            links: '.ubergrid-tabs li a',
            panels: '.ubergrid-panels li',
            firstPanel: '.ubergrid-panels li:first-child',
            firstLink: '.ubergrid-tabs li:first-child a'
        };
    };

    TabsView.prototype.events = {
        'click @ui.links': 'onLinkClicked'
    };

    TabsView.prototype.initialize = function(params) {
        TabsView.__super__.initialize.call(this, params);
        return this.bindUIElements();
    };

    TabsView.prototype.bindUIElements = function() {
        TabsView.__super__.bindUIElements.apply(this, arguments);
        this.ui.firstLink.addClass('ubergrid-current');
        return this.ui.firstPanel.addClass('ubergrid-current');
    };

    TabsView.prototype.onLinkClicked = function(event) {
        var index;
        event.preventDefault();
        this.ui.panels.removeClass('ubergrid-current');
        index = this.ui.links.index(event.target);
        this.ui.panels.eq(index).addClass('ubergrid-current');
        this.ui.links.parent().removeClass('ubergrid-current');
        return jQuery(event.target).parent().addClass('ubergrid-current');
    };

    return TabsView;

})(Marionette.ItemView);

LayoutTabsView = (function(_super) {
    __extends(LayoutTabsView, _super);

    function LayoutTabsView() {
        return LayoutTabsView.__super__.constructor.apply(this, arguments);
    }

    LayoutTabsView.prototype.ui = function() {
        return _.extend(LayoutTabsView.__super__.ui.apply(this, arguments), {
            "default": '#ubergrid-layout-default',
            under768: '#ubergrid-layout-768',
            under440: '#ubergrid-layout-440'
        });
    };

    LayoutTabsView.prototype.initialize = function() {
        LayoutTabsView.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        console.info(this.model.get('default'));
        this.defaultBinding = rivets.bind(this.ui["default"], this.model.get('default'));
        this.binding440 = rivets.bind(this.ui.under440, this.model.get('440'));
        return this.binding768 = rivets.bind(this.ui.under768, this.model.get('768'));
    };

    return LayoutTabsView;

})(TabsView);

ExtraTabsView = (function(_super) {
    __extends(ExtraTabsView, _super);

    function ExtraTabsView() {
        return ExtraTabsView.__super__.constructor.apply(this, arguments);
    }

    ExtraTabsView.prototype.initialize = function() {
        ExtraTabsView.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        return this.binding = rivets.bind(this.$el, {
            model: this.model
        });
    };

    return ExtraTabsView;

})(TabsView);

var PublishBlockView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

PublishBlockView = (function(_super) {
    __extends(PublishBlockView, _super);

    function PublishBlockView() {
        return PublishBlockView.__super__.constructor.apply(this, arguments);
    }

    PublishBlockView.prototype.ui = {
        previewButton: '#preview',
        publishButton: '#publish'
    };

    PublishBlockView.prototype.events = {
        'click @ui.previewButton': 'onPreviewClick'
    };

    PublishBlockView.prototype.initialize = function() {
        PublishBlockView.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        return this.ui.publishButton.removeAttr("disabled");
    };

    PublishBlockView.prototype.onPreviewClick = function() {
        jQuery("#preview-backdrop, #preview-window").show();
        jQuery("#preview-content").html("");
        jQuery.post("admin-ajax.php?action=uber_grid_preview", {
            data: JSON.stringify(this.model.toJSON()),
            id: jQuery('#post_ID').val()
        }, function(response) {
            jQuery("#preview-content").css("visibility", "hidden");
            jQuery("#preview-content").html(jQuery(response));
            jQuery("#preview-content").css("visibility", "visible");
            return setTimeout((function() {
                return jQuery("#preview-content .uber-grid").packery("layout");
            }), 200);
        });
        return jQuery("#preview-close, #preview-footer-close").click(function() {
            return jQuery("#preview-backdrop, #preview-window").hide();
        });
    };

    return PublishBlockView;

})(Marionette.ItemView);

var GridEditor,
    __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

GridEditor = (function(_super) {
    __extends(GridEditor, _super);

    function GridEditor() {
        this.onAutomaticClicked = __bind(this.onAutomaticClicked, this);
        this.enableManual = __bind(this.enableManual, this);
        this.onManualClicked = __bind(this.onManualClicked, this);
        return GridEditor.__super__.constructor.apply(this, arguments);
    }

    GridEditor.prototype.ui = {
        manualModeTab: '#ug-manual-mode-link',
        autoModeTab: '#ug-auto-mode-link'
    };

    GridEditor.prototype.events = {
        'click @ui.manualModeTab': 'onManualClicked',
        'click @ui.autoModeTab': 'onAutomaticClicked'
    };

    GridEditor.prototype.regions = {
        editor: '#ug-editor-wrapper'
    };

    GridEditor.prototype.initialize = function() {
        GridEditor.__super__.initialize.apply(this, arguments);
        this.bindUIElements();
        return this.chooseMode();
    };

    GridEditor.prototype.chooseMode = function() {
        if (this.model.get('mode') !== 'auto') {
            return this.enableManual();
        } else {
            return this.enableAutomatic();
        }
    };

    GridEditor.prototype.onManualClicked = function(e) {
        e.preventDefault();
        return this.enableManual();
    };

    GridEditor.prototype.enableManual = function() {
        this.ui.autoModeTab.removeClass('nav-tab-active');
        this.ui.manualModeTab.addClass('nav-tab-active');
        this.model.set('mode', 'manual');
        return this.editor.show(new ManualEditorView({
            collection: this.model.get('cells')
        }));
    };

    GridEditor.prototype.onAutomaticClicked = function(e) {
        e.preventDefault();
        return this.enableAutomatic();
    };

    GridEditor.prototype.enableAutomatic = function() {
        this.ui.autoModeTab.addClass('nav-tab-active');
        this.ui.manualModeTab.removeClass('nav-tab-active');
        this.model.set('mode', 'auto');
        return this.editor.show(new AutomaticEditorView({
            model: this.model.get('auto')
        }));
    };

    return GridEditor;

})(Marionette.LayoutView);

jQuery(function($) {
    var gridEditor, model;
    rivets.configure({
        prefix: 'rv',
        preloadData: true
    });
    rivets.binders.color = {
        publishes: true,
        bind: function(el) {
            return jQuery(el).wpColorPicker('option', 'change', (function(_this) {
                return function(e, ui) {
                    return _this.observer.setValue(ui.color.toCSS());
                };
            })(this));
        },
        unbind: function(el) {
            return jQuery(el).wpColorPicker('option', 'change', null);
        },
        routine: function(el, value) {
            return jQuery(el).wpColorPicker('color', value);
        }
    };
    rivets.binders['font-family'] = {
        publishes: true,
        bind: rivets.binders.value.bind,
        unbind: rivets.binders.value.unbind,
        routine: function(el, value) {
            var font, option, variant, variantsElement, _i, _len, _ref, _results;
            rivets.binders.value.routine(el, value);
            variantsElement = jQuery(el).next();
            variantsElement.find('option').remove();
            if (font = this.view.components.fonts.find(function(item) {
                    return item.get('family') === value;
                })) {
                _ref = font.get('variants');
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    variant = _ref[_i];
                    option = jQuery("<option />").text(variant);
                    if (option.text() === this.model.get('style')) {
                        option.attr('selected', 'selected');
                    }
                    _results.push(variantsElement.append(option));
                }
                return _results;
            } else {
                variantsElement.append(jQuery("<option value='light'>Light</option>"));
                variantsElement.append(jQuery("<option value='regular' selected='selected'>Regular</option>"));
                return variantsElement.append(jQuery("<option value='bold'>Bold</option>"));
            }
        }
    };
    model = new GridEditorModel();
    gridEditor = new GridEditor({
        el: jQuery('#post-body-content'),
        model: model
    });
    new LayoutTabsView({
        el: $('#grid_layout'),
        model: model.get('layout')
    });
    new ExtraTabsView({
        el: $('#grid_extras'),
        model: model
    });
    new FontsView({
        el: $('#grid_fonts'),
        model: model.get('fonts')
    });
    new PublishBlockView({
        el: $('#submitpost'),
        model: model
    });
    model.set(model.parse($("#ug-data").val()));
    gridEditor.chooseMode();
    return $("#post").submit(function(e) {
        $(this).parent().find(".spinner").show();
        return $("#ug-data").val(JSON.stringify(model.toJSON()));
    });
});
