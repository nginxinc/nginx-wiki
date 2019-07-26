/**
 * @file NGINX GDPR Module.
 *
 * Obtain and save consent from EU users to use a functional cookie (mandatory)
 * and a social cookie (optional).
 * Algorithm:
 *   Read cookies, check if a user has already given consent.
 *   If no consent given and user is from EU country, show popup.
 *   If consent is given save consent values in cookies.
 *
 * @author Paul Ferlito, Ferlito/van der Wyk
 */


var NX_GDPR = {

  consentGiven: false,
  clickedFormObj: null,
  formChecked: false,
  euCountries: [],
  euCountriesFileUrl: '_static/js/json-data/eu-codes.json',
  functionalCookieName: 'nx_functional_cookie_consent',
  socialCookieName: 'nx_social_cookie_consent',
  countryCode: "",
  canadaCode: 'CA',
  usCode: 'US',

  init: function ($) {
    this.loadEUCountries($).done(function () {
      this.countryCode = this.getCountryCode();
      this.setGlobals();
      // set up events when document is ready
      $(function() {
        this.setupEvents($);
      }.bind(this));
      // if new visitor from EU country
      if (!this.consentGiven && this.isEUCountry(this.countryCode)) {
        // show popup after page load.
        window.onload = function () {
          NX_GDPR.showPopup();
        }
      }
    }.bind(this));
  },

  /**
   * Load EU country codes from JSON file and cache them in session storage.
   * @returns a deferred object.
   */
  loadEUCountries: function ($) {
    // check cache
    var euCountries;
    if (sessionStorage.euCountries) {
      euCountries = JSON.parse(sessionStorage.euCountries);
    }

    if (euCountries) {
      this.euCountries = euCountries;
      return $.Deferred().resolve(euCountries);
    } else {
      return $.getJSON(this.euCountriesFileUrl)
        .done(function (data) {
          sessionStorage.euCountries = JSON.stringify(data);
          this.euCountries = data;
        }.bind(this))
        .fail(function () {
          console.error('GDPR: could not load country file from ' + this.euCountriesFileUrl);
        }.bind(this))
    }
  },

  /**
   * Set up event listeners.
   */
  setupEvents: function () {
    document.getElementById('gdpr-more-info').addEventListener('click',function(e) {
      e.preventDefault();
      this.hideMain();
      this.showInfo();
    }.bind(this),false);

    document.getElementById('gdpr-less-info').addEventListener('click',function(e) {
      e.preventDefault();
      this.showMain();
      this.hideInfo();
    }.bind(this));

    document.getElementById('nx_gdpr_accept_btn').addEventListener('click',function() {
      this.userAccept();
    }.bind(this));
  },

  /**
   * Hide main popup panel.
   */
  hideMain: function () {
    this.hideElement('nx_gdpr_modal_main2');
  },

  /**
   * Show main popup panel.
   */
  showMain: function () {
    this.showElement('nx_gdpr_modal_main2');
  },

  /**
   * Show info popup panel.
   */
  showInfo: function () {
    this.showElement('nx_gdpr_modal_more_info2');
  },

  /**
   * Hide info popup panel.
   */
  hideInfo: function () {
    this.hideElement('nx_gdpr_modal_more_info2');
  },

  /**
   * Sets global variables according to consent cookie values.
   */
  setGlobals: function () {
    var fcc = NX_COOKIES.getCookie(this.functionalCookieName);
    var scc = NX_COOKIES.getCookie(this.socialCookieName);
    if (fcc !== "" || scc !== "") {
      this.consentGiven = true;

      if (fcc === "yes") {
        NX_GDPR_FUNCTIONAL_COOKIE_CONSENT = 'yes';
      }
      if (scc === "yes") {
        NX_GDPR_SOCIAL_COOKIE_CONSENT = 'yes';
      }
    }
    else if (!this.isEUCountry(this.countryCode)) {
      NX_GDPR_FUNCTIONAL_COOKIE_CONSENT = 'yes';
      NX_GDPR_SOCIAL_COOKIE_CONSENT = 'yes';
    }
  },

  /**
   * Records individual selection. Sets cookie according to selection.
   * @param type
   * @param value
   */
  setConsent: function (type, value) {
    // type can be 'functional' || 'social' || 'both' , value can be 'yes'|| 'no'
    switch (type) {
      case 'both':
        NX_COOKIES.setCookie(this.functionalCookieName, value, 129600); //180 month
        NX_COOKIES.setCookie(this.socialCookieName, value, 129600); //180 month
        this.updateFormSocialConsentField(value);
        this.updateFormFunctionalConsentField(value);
        break;
      case 'social':
        NX_COOKIES.setCookie(this.socialCookieName, value, 129600); //180 month
        this.updateFormSocialConsentField(value);
        break;
      case 'functional':
        NX_COOKIES.setCookie(this.functionalCookieName, value, 129600); //180 month
        this.updateFormFunctionalConsentField(value);
        break;
    }
    this.setGlobals();
  },

  deleteConsent: function (type) {
    // t can be 'functional' || 'social' || 'both'
    switch (type) {
      case 'both':
        NX_COOKIES.deleteCookie(this.functionalCookieName);
        NX_COOKIES.deleteCookie(this.socialCookieName);
        break;
      case 'functional':
        NX_COOKIES.deleteCookie(this.functionalCookieName);
        break;
      case 'social':
        NX_COOKIES.deleteCookie(this.socialCookieName);
        break;
    }
  },

  /**
   * Acceptance handler. Records user selections.
   */
  userAccept: function () {
    if (document.getElementById('nx_gdpr_social_con_checkbox').checked) {
      this.setConsent('both', 'yes');
    }
    else {
      this.setConsent('social', 'no');
      this.setConsent('functional', 'yes');
    }

    // If the GDPR popup was triggered by a form submission submit the form
    // and hide the popup.
    if (this.clickedFormObj !== null) {
      this.setGlobals();
      var _form = this.clickedFormObj;
      this.formChecked = true;
      var submit_button = _form.find(".mktf_submit_button").first();
      submit_button.trigger("click");
      this.hidePopup();
    }
    else {
      document.getElementById('nx_gdpr_accept_btn').disabled = true;
      location.reload();
    }
  },

  /**
   * Record social opt-in selection in hidden Marketo field.
   * @param value
   */
  updateFormSocialConsentField: function (value) {
    if (this.clickedFormObj !== null) {
      var _form = this.clickedFormObj;
      _form.find(".mktf_Cookie_Opt_In__c").first().val(value);
    }
  },

  /**
   * Record functional opt-in selection in hidden Marketo field.
   * @param value
   */
  updateFormFunctionalConsentField: function (value) {
    if (this.clickedFormObj !== null) {
      var _form = this.clickedFormObj;
      _form.find('.mktf_Functional_Cookie_Opt_In__c').first().val(value);
    }
  },

  /**
   * Verify GDPR acceptance before form submission.
   * Called when a form with a Country Code field is submitted.
   * @param countryCode
   * @param _form form element
   * @returns {boolean} true to allow form submission
   */
  verifyAcceptance: function (countryCode, _form) {
    var allow_submission = false;

    if (this.formChecked || countryCode === "") {
      allow_submission = true;
    } else {
      // if EU visitor has not consented show the popup and block submission
      if (this.isEUCountry(countryCode) && !this.consentGiven) {
        this.clickedFormObj = _form; // flag that we are in a form submission
        this.showPopup();
        this.animatePopup();
        allow_submission = false;
      }
      else {
        allow_submission = true;
      }
    }
    return allow_submission;
  },

  /**
   * Show GDPR popup.
   */
  showPopup: function () {
    // set the state of the checkboxes according to the cookies.
    var scc = NX_COOKIES.getCookie(this.socialCookieName);
    if (scc === 'no') {
      document.getElementById('nx_gdpr_social_con_checkbox').checked = false;
    }
    this.showElement('nx_gdpr_modal2');
  },

  /**
   * Hide GDPR popup.
   */
  hidePopup: function () {
    this.hideElement('nx_gdpr_modal2');
  },

  /**
   * Animate the popup. Called if the user is trying to submit a form
   * without opting in first.
   */
  animatePopup: function () {
    var elm = document.getElementById('nx_gdpr_modal2');
    elm.classList.add('animate');
    setTimeout(function() {
      elm.classList.remove('animate');
    },1000);
  },

  /**
   * Show an element.
   * @param id element id
   */
  showElement: function (id) {
    var elm = document.getElementById(id);
    elm.classList.remove('hidden');
  },

  /**
   * Hide an element.
   * @param id element id
   */
  hideElement: function (id) {
    var elm = document.getElementById(id);
    elm.classList.add('hidden');
  },

  /**
   * Return true if a country code is in the EU.
   * If no country code is passed use the last known country code.
   * @param countryCode
   * @returns {boolean}
   */
  isEUCountry: function (countryCode) {
    // use last known country code
    if (!countryCode) {
      countryCode = this.countryCode;
    }
    return this.euCountries.indexOf(countryCode) > -1;
  },

  /**
   * Return true if the country code is Canada.
   * If no country code is passed use the last known country code.
   * @param countryCode
   * @return {boolean}
   */
  isCanada: function (countryCode) {
    // use last known country code
    if (!countryCode) {
      countryCode = this.countryCode;
    }
    return countryCode === this.canadaCode;
  },

  /**
   * Return true if the country code is the US.
   * If no country code is passed use the last known country code.
   * @param countryCode
   * @return {boolean}
   */
  isUS: function (countryCode) {
    // use last known country code
    if (!countryCode) {
      countryCode = this.countryCode;
    }
    return countryCode === this.usCode;
  },

  /**
   * Get the country code from the geoip cookie.
   * @returns {string}
   */
  getCountryCode: function () {

    var countryCode = "";
    var geoLocation = NX_COOKIES.getCookie('geoip');

    if (geoLocation !== "") {
      var geoCodes = geoLocation.split(',');
      countryCode = geoCodes[0];
    }
    return countryCode;

  }

};//end of NX_GDPR

// initialize NX_GDPR object
NX_GDPR.init(jQuery);
