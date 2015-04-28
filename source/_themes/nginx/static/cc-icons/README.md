Creative Commons Web Fonts
======

Creative Commons Web Fonts is a suite of pictographic Creative Commons icons for easy scalable vector graphics,
created and maintained by [Ricardo Barros](http://twitter.com/richardba).

##License
- Creative Commons Web Fonts project and documentation is licensed under the CC BY 4.0 License:
  - http://creativecommons.org/licenses/by/4.0/
- Creative Commons Web Fonts source code is licensed under MIT License:
  - http://opensource.org/licenses/mit-license.html
  
##Changelog
- v1.2.1 - Minor fix for chrome rendering.
- v1.2.0 - Fix font width and height, as well as horizontal and vertical centering.
- v1.0.1 - Minor font height fixes.
- v1.0.0 - Fully functional library.
- v0.2.0 - Released font with all logos and glyphs for Creative Commons. Control classes in the works.
- v0.1.1 - Based on files by [Font Awesome] (https://github.com/FortAwesome/Font-Awesome), updated README.md file along with initial CSS control classes
- v0.1.0 - Initial release with simple glyphs, and no CSS control classes.

##Versioning

Creative Commons Web Fonts will be maintained under the Semantic Versioning guidelines as much as possible. Releases will be numbered
with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions, including new icons, without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org.

##Author
- Email: richardtrle at gmail dot com
- Twitter: http://twitter.com/richardba
- GitHub: https://github.com/richardba

##Component
To include as a [component](http://github.com/component/component), just run

    $ component install richardba/cc-icons

Or add

    "richardba/cc-icons": "*"

to the `dependencies` in your `component.json`.

## Hacking on Creative Commons Web Fonts

From the root of the repository, install the tools used to develop.

    $ bundle install
    $ npm install

Build the project and documentation:

    $ bundle exec jekyll build

Or serve it on a local server on http://localhost:7998/cc-icons/:

    $ bundle exec jekyll serve
