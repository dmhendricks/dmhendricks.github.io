/* File Icon Vectors - https://github.com/dmhendricks/file-icon-vectors */

!function(s){s.fn.replaceClass=function(remove,add){var e=add||remove;return e&&this.removeClass(add?remove:this.className).addClass(e),this}}(jQuery);

;var ICON_NS = ICON_NS || {};

(function($, undefined) {

  var uri = URI();
  var qsRegex;
  var _sidebar = $( '#sidebar' );
  var _container = $( '#container' );
  var _branch = $( '#branch', _sidebar );
  var _section_home = $( 'section#home', _container );
  var _section_icons = $( 'section#icons', _container );
  var _icons = $( '#icons', _container );
  var _icons_grid = $( '#icon_grid', _icons );
  var _filter = $( '#filter', _icons )

  ICON_NS.Core = {

    icons_sets: {
      'classic': {
        'label': 'Classic',
        'prefix': 'cla',
        'dark': false
      },
      'vivid': {
        'label': 'Vivid',
        'prefix': 'viv',
        'dark': false
      },
      'square-o': {
        'label': 'Square Outline',
        'prefix': 'sqo',
        'dark': false
      },
      'high-contrast': {
        'label': 'High Contrast',
        'prefix': 'hct',
        'dark': true
      },
      'extra': {
        'label': 'Classic',
        'prefix': 'ext',
        'dark': false
      }
    },
    variables: {
      'version': '1.0.0',
      'icon-count': {
        'release': '1170',
        'develop': '1500+'
      },
      'set-count': {
        'release': '3',
        'develop': '5'
      }
    },
    url_prefix: {
      'release': 'https://cdn.jsdelivr.net/npm/file-icon-vectors@1.0.0/',
      'develop': 'https://raw.githack.com/dmhendricks/file-icon-vectors/master/',
      'develop-cdn': 'https://rawcdn.githack.com/dmhendricks/file-icon-vectors/master/'
    },
    onLoad: function() {

      if( uri.hasQuery( 'mode', 'dark' ) ) {
        $( 'body' ).toggleClass( 'dark-mode' );
        $( '.Switch' ).replaceClass( 'Off', 'On' );
      }

      // Set placeholder values
      ICON_NS.Core.setPlaceholders();

      // Set current view/branch based on querystring
      ICON_NS.Core.changeBranch( null, URI.parseQuery( uri.query() ).branch || 'release' );
      ICON_NS.Core.changeView( null, URI.parseQuery( uri.query() ).view || 'home' );

    },
    changeView: function( event, _view ) {

      if( event ) event.preventDefault();

      _view = _view || $( this ).data( 'view' );
      _label = _view || $( this ).html();

      $( 'a.menu-item-trigger-set', _sidebar ).removeClass( 'active' );
      $( 'section' ).hide();

      // Show home page
      if( !_view || _view == 'home' ) {

        ICON_NS.Core.removeUriAttr( 'view' );
        _section_home.show();

      } else {

        $( this ).addClass( 'active' );
        ICON_NS.Core.setUriAttr( 'view', _view );

        // Switch to Dark Mode
        if( ICON_NS.Core.icons_sets[_view].dark ) {
          $( 'body' ).addClass( 'dark-mode' );
          $( '.Switch' ).replaceClass( 'Off', 'On' );
        }

        // Set content
        $( '.set-label', _section_icons ).html( _label == 'square-o' ? 'Square Outline' : _label.replace( '-', ' ' ) );
        ICON_NS.Core.getIcons( _view );
        _section_icons.show();

        // Initialize filter search
        ICON_NS.Filter.init();

      }


      return false;

    },
    changeBranch: function( event, branch ) {

      var branch_slug = branch ? branch : $( this ).val();
      if( event ) ICON_NS.Core.setUriAttr( 'branch', branch_slug );
      $( '.branch-release, .branch-develop' ).hide();
      $( '.branch-' + branch_slug ).show();
      $( '#source' ).attr( 'href', ( ICON_NS.Core.url_prefix[branch_slug] ) + 'dist/file-icon-vectors.min.css' );
      if( event ) {
        ICON_NS.Core.changeView( null, 'home' );
      } else {
        _branch.val( branch_slug ).change();
      }

      // Set placeholder values
      ICON_NS.Core.setPlaceholders();

    },
    toggleSwitch: function( event ) {

      // Toggle CSS
      $( 'body' ).toggleClass( 'dark-mode' );

      // Toggle switch
      $( this ).toggleClass('On').toggleClass('Off');

      // Set URI
      ICON_NS.Core.toggletUriAttr( 'mode', 'dark' );

    },
    setUriAttr: function( id, val ) {

      val = val || 'true';
      uri = URI();
      uri.setQuery( id, val );
      window.history.pushState( null, null, uri.toString() );

    },
    removeUriAttr: function( id ) {

      uri = URI();
      uri.removeQuery( id );
      window.history.pushState( null, null, uri.toString() );

    },
    toggletUriAttr: function( id, val ) {

      val = val || 'true';
      uri = URI();

      if( uri.hasQuery( id ) ) {
        uri.removeQuery( id );
      } else {
        uri.setQuery( id, val );
      }

      window.history.pushState( null, null, uri.toString() );

    },
    getIcons: function( _set ) {

      var _branch = URI.parseQuery( uri.query() ).branch || 'release';
      var url_prefix = ICON_NS.Core.url_prefix[_branch];
      $.get( url_prefix + 'dist/icons/' + _set + '/catalog.json' )
        .done(function( icons ) {

          _icons_grid.empty();

          var icon_html = '<div class="pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-8 icon"><span class="fiv-%s fiv-icon-%s"></span><p class="icon-desc">%s</p></div>';
          for ( var idx = 0; idx < icons.length; idx++ ) {
            _icons_grid.append( $.sprintf( icon_html, ICON_NS.Core.icons_sets[_set]['prefix'], icons[idx], icons[idx] ) );
          }

      });

    },
    setPlaceholders: function() {

      var _branch = URI.parseQuery( uri.query() ).branch || 'release';
      $( '.icon-count', _sidebar ).html( ICON_NS.Core.variables['icon-count'][_branch] );
      $( '.set-count', _sidebar ).html( ICON_NS.Core.variables['set-count'][_branch] );
      $( '.label-release', _container ).html( 'Current Release (' + ICON_NS.Core.variables.version + ')' );

    },
    preventDefault: function() {
      event.preventDefault();
      return false;
    }

  };

  ICON_NS.Filter = {

    init: function() {

      _filter.on( 'keyup', ICON_NS.Filter.debounce( function() {

        var value = $( this ).val().toLowerCase();
        $( '.icon', _icons_grid ).filter( function() {
          $( this ).toggle( $( this ).text().toLowerCase().indexOf( value ) > -1 );
        });

        if($( '.icon', _icons_grid ).filter( ':visible' ).length < 1 ) {
          $( '#no_results' ).show();
        } else {
          $( '#no_results' ).hide();
        }

      }, 200 ) );

    },
    debounce: function( fn, wait, immediate ) {

      var timeout;
    	return function() {
    		var context = this, args = arguments;
    		clearTimeout( timeout );
    		timeout = setTimeout( function() {
    			timeout = null;
    			if ( !immediate ) fn.apply( context, args );
    		}, wait);
    		if ( immediate && !timeout ) fn.apply( context, args );
    	};

    }

  };

  // Paint page on load
  ICON_NS.Core.onLoad();

  // Initialize third-party libraries
  $( '.code-box-copy' ).codeBoxCopy();
  $( '#branch' ).selectize();

  // Change page
  $( 'a.menu-item-trigger-set', _sidebar ).on( 'click', ICON_NS.Core.changeView );

  // Toggle switch - Dark Mode
  $( '.Switch', _container ).on( 'click', ICON_NS.Core.toggleSwitch );

  // Branch changed
  _branch.on( 'change', ICON_NS.Core.changeBranch );

  // Disable filter form field submit
  $( 'form', _container ).on( 'submit', ICON_NS.Core.preventDefault );

})( window.jQuery );
