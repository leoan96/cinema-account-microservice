'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">cinema documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link">AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' : 'data-target="#xs-controllers-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' :
                                            'id="xs-controllers-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' }>
                                            <li class="link">
                                                <a href="controllers/AccountAdminController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AccountController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' : 'data-target="#xs-injectables-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' :
                                        'id="xs-injectables-links-module-AccountModule-f539c72e0f2b07614ca67f64c0e59fab"' }>
                                        <li class="link">
                                            <a href="injectables/AccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AccountService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthenticationModule.html" data-type="entity-link">AuthenticationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthenticationModule-1ddcbca10fd1aa913e54dfdf279459dd"' : 'data-target="#xs-injectables-links-module-AuthenticationModule-1ddcbca10fd1aa913e54dfdf279459dd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthenticationModule-1ddcbca10fd1aa913e54dfdf279459dd"' :
                                        'id="xs-injectables-links-module-AuthenticationModule-1ddcbca10fd1aa913e54dfdf279459dd"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigurationModule.html" data-type="entity-link">ConfigurationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConfigurationModule-50bcf9fbb77b425c310c64cb70ac69be"' : 'data-target="#xs-injectables-links-module-ConfigurationModule-50bcf9fbb77b425c310c64cb70ac69be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigurationModule-50bcf9fbb77b425c310c64cb70ac69be"' :
                                        'id="xs-injectables-links-module-ConfigurationModule-50bcf9fbb77b425c310c64cb70ac69be"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigurationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigurationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoggerModule.html" data-type="entity-link">LoggerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link">RedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RedisModule-35dc7139621dda76d30af3dfb6ba7917"' : 'data-target="#xs-injectables-links-module-RedisModule-35dc7139621dda76d30af3dfb6ba7917"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RedisModule-35dc7139621dda76d30af3dfb6ba7917"' :
                                        'id="xs-injectables-links-module-RedisModule-35dc7139621dda76d30af3dfb6ba7917"' }>
                                        <li class="link">
                                            <a href="injectables/RedisConnectService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RedisConnectService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisPromiseService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RedisPromiseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisSubscriberService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RedisSubscriberService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SessionModule.html" data-type="entity-link">SessionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SessionModule-2dee642e9887e8e1147e97b0eb0fdb49"' : 'data-target="#xs-injectables-links-module-SessionModule-2dee642e9887e8e1147e97b0eb0fdb49"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SessionModule-2dee642e9887e8e1147e97b0eb0fdb49"' :
                                        'id="xs-injectables-links-module-SessionModule-2dee642e9887e8e1147e97b0eb0fdb49"' }>
                                        <li class="link">
                                            <a href="injectables/RedisSubscribeExpiredService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RedisSubscribeExpiredService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Account.html" data-type="entity-link">Account</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllExceptionFilter.html" data-type="entity-link">AllExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountDTO.html" data-type="entity-link">CreateAccountDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountRoleDTO.html" data-type="entity-link">CreateAccountRoleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomLogger.html" data-type="entity-link">CustomLogger</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorException.html" data-type="entity-link">ErrorException</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link">LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/MongoExceptionFilter.html" data-type="entity-link">MongoExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAccountDTO.html" data-type="entity-link">UpdateAccountDTO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link">LoggingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link">ValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link">RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccountProfile.html" data-type="entity-link">AccountProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExpressSessionUser.html" data-type="entity-link">ExpressSessionUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Login.html" data-type="entity-link">Login</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRedisSession.html" data-type="entity-link">UserRedisSession</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});