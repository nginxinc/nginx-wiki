Set Misc
========

= Name =

'''ngx_set_misc''' - Various set_xxx directives added to nginx's rewrite module (md5/sha1, sql/json quoting, and many more)

''This module is not distributed with the Nginx source.'' See [[#Installation|the installation instructions]].

= Version =

This document describes ngx_set_misc [https://github.com/openresty/set-misc-nginx-module/tags v0.28] released on 21 January 2015.

= Synopsis =

<geshi lang="nginx">
    location /foo {
        set $a $arg_a;
        set_if_empty $a 56;

        # GET /foo?a=32 will yield $a == 32
        # while GET /foo and GET /foo?a= will
        # yeild $a == 56 here.
    }

    location /bar {
        set $foo "hello\n\n'\"\\";
        set_quote_sql_str $foo $foo; # for mysql

        # OR in-place editing:
        #   set_quote_sql_str $foo;

        # now $foo is: 'hello\n\n\'\"\\'
    }

    location /bar {
        set $foo "hello\n\n'\"\\";
        set_quote_pgsql_str $foo;  # for PostgreSQL

        # now $foo is: E'hello\n\n\'\"\\'
    }

    location /json {
        set $foo "hello\n\n'\"\\";
        set_quote_json_str $foo $foo;

        # OR in-place editing:
        #   set_quote_json_str $foo;

        # now $foo is: "hello\n\n'\"\\"
    }

    location /baz {
        set $foo "hello%20world";
        set_unescape_uri $foo $foo;

        # OR in-place editing:
        #   set_unescape_uri $foo;

        # now $foo is: hello world
    }

    upstream_list universe moon sun earth;
    upstream moon { ... }
    upstream sun { ... }
    upstream earth { ... }
    location /foo {
        set_hashed_upstream $backend universe $arg_id;
        drizzle_pass $backend; # used with ngx_drizzle
    }

    location /base32 {
        set $a 'abcde';
        set_encode_base32 $a;
        set_decode_base32 $b $a;

        # now $a == 'c5h66p35' and
        # $b == 'abcde'
    }

    location /base64 {
        set $a 'abcde';
        set_encode_base64 $a;
        set_decode_base64 $b $a;

        # now $a == 'YWJjZGU=' and
        # $b == 'abcde'
    }

    location /hex {
        set $a 'abcde';
        set_encode_hex $a;
        set_decode_hex $b $a;

        # now $a == '6162636465' and
        # $b == 'abcde'
    }

    # GET /sha1 yields the output
    #   aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
    location /sha1 {
        set_sha1 $a hello;
        echo $a;
    }

    # ditto
    location /sha1 {
        set $a hello;
        set_sha1 $a;
        echo $a;
    }

    # GET /today yields the date of today in local time using format 'yyyy-mm-dd'
    location /today {
        set_local_today $today;
        echo $today;
    }

    # GET /signature yields the hmac-sha-1 signature
    # given a secret and a string to sign
    # this example yields the base64 encoded singature which is
    # "HkADYytcoQQzqbjQX33k/ZBB/DQ="
    location /signature {
        set $secret_key 'secret-key';
        set $string_to_sign "some-string-to-sign";
        set_hmac_sha1 $signature $secret_key $string_to_sign;
        set_encode_base64 $signature $signature;
        echo $signature;
    }

    location = /rand {
        set $from 3;
        set $to 15;
        set_random $rand $from $to;

        # or write directly
        #   set_random $rand 3 15;

        echo $rand;  # will print a random integer in the range [3, 15]
    }
</geshi>

= Description =

This module extends the standard HttpRewriteModule's directive set to provide more functionalities like URI escaping and unescaping, JSON quoting, Hexadecimal/MD5/SHA1/Base32/Base64 digest encoding and decoding, random number generator, and more!

Every directive provided by this module can be mixed freely with other [[HttpRewriteModule]]'s directives, like [[HttpRewriteModule#if|if]] and [[HttpRewriteModule#set|set]]. (Thanks to the [https://github.com/simpl/ngx_devel_kit Nginx Devel Kit]!)

= Directives =

== set_if_empty ==
'''syntax:''' ''set_if_empty $dst <src>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Assign the value of the argument <code><src></code> if and only if variable <code>$dst</code> is empty (i.e., not found or has an empty string value).

In the following example,

<geshi lang="nginx">
    set $a 32;
    set_if_empty $a 56;
</geshi>

the variable <code>$dst</code> will take the value 32 at last. But in the sample

<geshi lang="nginx">
    set $a '';
    set $value "hello, world"
    set_if_empty $a $value;
</geshi>

<code>$a</code> will take the value <code>"hello, world"</code> at last.

== set_quote_sql_str ==
'''syntax:''' ''set_quote_sql_str $dst <src>''

'''syntax:''' ''set_quote_sql_str $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will quote the value of the second argument <code><src></code> by MySQL's string value quoting rule and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello\n\r'\"\\";
        set_quote_sql_str $quoted $value;
    
        echo $quoted;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="sql">
'hello\n\r\'\"\\'
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello\n\r'\"\\";
        set_quote_sql_str $value;
    
        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive is usually used to prevent SQL injection.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_quote_pgsql_str ==
'''syntax:''' ''set_quote_pgsql_str $dst <src>''

'''syntax:''' ''set_quote_pgsql_str $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

Very much like [[#set_quote_sql_str|set_quote_sql_str]], but with PostgreSQL quoting rules for SQL string literals.

== set_quote_json_str ==
'''syntax:''' ''set_quote_json_str $dst <src>''

'''syntax:''' ''set_quote_json_str $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will quote the value of the second argument <code><src></code> by JSON string value quoting rule and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello\n\r'\"\\";
        set_quote_json_str $quoted $value;
    
        echo $quoted;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="javascript">
"hello\n\r'\"\\"
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello\n\r'\"\\";
        set_quote_json_str $value;
    
        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_unescape_uri ==
'''syntax:''' ''set_unescape_uri $dst <src>''

'''syntax:''' ''set_unescape_uri $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will unescape the value of the second argument <code><src></code> as a URI component and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set_unescape_uri $key $arg_key;
        echo $key;
    }
</geshi>

Then request <code>GET /test?key=hello+world%21</code> will yield the following output

<geshi lang="text">
hello world!
</geshi>

The nginx standard [[HttpCoreModule#$arg_PARAMETER|$arg_PARAMETER]] variable holds the raw (escaped) value of the URI parameter. So we need the <code>set_unescape_uri</code> directive to unescape it first.

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $key $arg_key;
        set_unescape_uri $key;

        echo $key;
    }
</geshi>

then request <code>GET /test?key=hello+world%21</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_escape_uri ==
'''syntax:''' ''set_escape_uri $dst <src>''

'''syntax:''' ''set_escape_uri $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

Very much like the [[#set_unescape_uri|set_unescape_uri]] directive, but does the conversion the other way around, i.e., URL component escaping.

== set_hashed_upstream ==
'''syntax:''' ''set_hashed_upstream $dst <upstream_list_name> <src>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Hashes the string argument <code><src></code> into one of the upstream name included in the upstream list named <code><upstream_list_name></code>. The hash function being used is simple modulo.

Here's an example,

<geshi lang="nginx">
    upstream moon { ... }
    upstream sun { ... }
    upstream earth { ... }

    upstream_list universe moon sun earth;

    location /test {
        set_unescape_uri $key $arg_key;
        set $list_name universe;
        set_hashed_upstream $backend $list_name $key;

        echo $backend;        
    }
</geshi>

Then <code>GET /test?key=blah</code> will output either "moon", "sun", or "earth", depending on the actual value of the <code>key</code> query argument.

This directive is usually used to compute an nginx variable to be passed to [[HttpMemcModule]]'s [[HttpMemcModule#memc_pass|memc_pass]] directive, [[HttpRedis2Module]]'s [[HttpRedis2Module#redis2_pass]] directive, and [[HttpProxyModule]]'s [[HttpProxyModule#proxy_pass|proxy_pass]] directive, among others.

== set_encode_base32 ==
'''syntax:''' ''set_encode_base32 $dst <src>''

'''syntax:''' ''set_encode_base32 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will encode the value of the second argument <code><src></code> to its base32(hex) digest and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set $raw "abcde";
        set_encode_base32 $digest $raw;

        echo $digest;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
c5h66p35
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

RFC forces the <code>[A-Z2-7]</code> RFC-3548 compliant encoding, but we are using the "base32hex" encoding (<code>[0-9a-v]</code>) by default. The [[#set_base32_alphabet|set_base32_alphabet]] directive (first introduced in <code>v0.28</code>) allows you to change the alphabet used for encoding/decoding so RFC-3548 compliant encoding is still possible by custom configurations.

By default, the <code>=</code> character is used to pad the left-over bytes due to alignment. But the padding behavior can be completely disabled by setting [[#set_base32_padding|set_base32_padding]] <code>off</code>.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "abcde";
        set_encode_base32 $value;

        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_base32_padding ==
'''syntax:''' ''set_base32_padding on|off''

'''default:''' ''on''

'''context:''' ''http, server, server if, location, location if''

'''phase:''' ''no''

This directive can control whether to pad left-over bytes with the "=" character when encoding a base32 digest by the
[[#set_encode_base32|set_encode_base32]] directive.

This directive was first introduced in <code>v0.28</code>. If you use earlier versions of this module, then you should use [[#set_misc_base32_padding|set_misc_base32_padding]] instead.

== set_misc_base32_padding ==
'''syntax:''' ''set_misc_base32_padding on|off''

'''default:''' ''on''

'''context:''' ''http, server, server if, location, location if''

'''phase:''' ''no''

This directive has been deprecated since <code>v0.28</code>. Use [[#set_base32_padding|set_base32_padding]] instead if you are using <code>v0.28+</code>.

== set_base32_alphabet ==
'''syntax:''' ''set_base32_alphabet <alphabet>''

'''default:''' ''"0123456789abcdefghijklmnopqrstuv"''

'''context:''' ''http, server, server if, location, location if''

'''phase:''' ''no''

This directive controls the alphabet used for encoding/decoding a base32 digest. It accepts a string containing the desired alphabet like "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" for standard alphabet.

Extended (base32hex) alphabet is used by default.

This directive was first introduced in <code>v0.28</code>.

== set_decode_base32 ==
'''syntax:''' ''set_decode_base32 $dst <src>''

'''syntax:''' ''set_decode_base32 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

Similar to the [[#set_encode_base32|set_encode_base32]] directive, but does exactly the the opposite operation, .i.e, decoding a base32(hex) digest into its original form.

== set_encode_base64 ==
'''syntax:''' ''set_encode_base64 $dst <src>''

'''syntax:''' ''set_encode_base64 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will encode the value of the second argument <code><src></code> to its base64 digest and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set $raw "abcde";
        set_encode_base64 $digest $raw;

        echo $digest;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
YWJjZGU=
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "abcde";
        set_encode_base64 $value;

        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_decode_base64 ==
'''syntax:''' ''set_decode_base64 $dst <src>''

'''syntax:''' ''set_decode_base64 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

Similar to the [[#set_encode_base64|set_encode_base64]] directive, but does exactly the the opposite operation, .i.e, decoding a base64 digest into its original form.

== set_encode_hex ==
'''syntax:''' ''set_encode_hex $dst <src>''

'''syntax:''' ''set_encode_hex $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will encode the value of the second argument <code><src></code> to its hexadecimal digest and assign the result into the first argument, variable <code>$dst</code>. For example,

<geshi lang="nginx">
    location /test {
        set $raw "章亦春";
        set_encode_hex $digest $raw;

        echo $digest;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
e7aba0e4baa6e698a5
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "章亦春";
        set_encode_hex $value;

        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_decode_hex ==
'''syntax:''' ''set_decode_hex $dst <src>''

'''syntax:''' ''set_decode_hex $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

Similar to the [[#set_encode_hex|set_encode_hex]] directive, but does exactly the the opposite operation, .i.e, decoding a hexadecimal digest into its original form.

== set_sha1 ==
'''syntax:''' ''set_sha1 $dst <src>''

'''syntax:''' ''set_sha1 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will encode the value of the second argument <code><src></code> to its [http://en.wikipedia.org/wiki/SHA-1 SHA-1] digest and assign the result into the first argument, variable <code>$dst</code>. The hexadecimal form of the <code>SHA-1</code> digest will be generated automatically, use [[#set_decode_hex|set_decode_hex]] to decode the result if you want the binary form of the <code>SHA-1</code> digest.

For example,

<geshi lang="nginx">
    location /test {
        set $raw "hello";
        set_sha1 $digest $raw;

        echo $digest;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello";
        set_sha1 $value;

        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_md5 ==
'''syntax:''' ''set_md5 $dst <src>''

'''syntax:''' ''set_md5 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

'''category:''' ''ndk_set_var_value''

When taking two arguments, this directive will encode the value of the second argument <code><src></code> to its [http://en.wikipedia.org/wiki/MD5 MD5] digest and assign the result into the first argument, variable <code>$dst</code>. The hexadecimal form of the <code>MD5</code> digest will be generated automatically, use [[#set_decode_hex|set_decode_hex]] to decode the result if you want the binary form of the <code>MD5</code> digest.

For example,

<geshi lang="nginx">
    location /test {
        set $raw "hello";
        set_md5 $digest $raw;

        echo $digest;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
5d41402abc4b2a76b9719d911017c592
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

When taking a single argument, this directive will do in-place modification of the argument variable. For example,

<geshi lang="nginx">
    location /test {
        set $value "hello";
        set_md5 $value;

        echo $value;
    }
</geshi>

then request <code>GET /test</code> will give exactly the same output as the previous example.

This directive can be invoked by [[HttpLuaModule]]'s [[HttpLuaModule#ndk.set_var.DIRECTIVE|ndk.set_var.DIRECTIVE]] interface and [[HttpArrayVarModule]]'s [[HttpArrayVarModule#array_map_op|array_map_op]] directive.

== set_hmac_sha1 ==
'''syntax:''' ''set_hmac_sha1 $dst <secret_key> <src>''

'''syntax:''' ''set_hmac_sha1 $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Computes the [http://en.wikipedia.org/wiki/HMAC HMAC-SHA1] digest of the argument <code><src></code> and assigns the result into the argument variable <code>$dst</code> with the secret key <code><secret_key></code>.

The raw binary form of the <code>HMAC-SHA1</code> digest will be generated, use [[#set_encode_base64|set_encode_base64]], for example, to encode the result to a textual representation if desired.

For example,

<geshi lang="nginx">
    location /test {
        set $secret 'thisisverysecretstuff';
        set $string_to_sign 'some string we want to sign';
        set_hmac_sha1 $signature $secret $string_to_sign;
        set_encode_base64 $signature $signature;
        echo $signature;
    }
</geshi>

Then request <code>GET /test</code> will yield the following output

<geshi lang="text">
R/pvxzHC4NLtj7S+kXFg/NePTmk=
</geshi>

Please note that we're using [[HttpEchoModule]]'s [[HttpEchoModule#echo|echo directive]] here to output values of nginx variables directly.

This directive requires the OpenSSL library enabled in your Nignx build (usually by passing the <code>--with-http_ssl_module</code> option to the <code>./configure</code> script).

== set_random ==
'''syntax:''' ''set_random $res <from> <to>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Generates a (pseudo) random number (in textual form) within the range <code>[<$from>, <$to>]</code> (inclusive).

Only non-negative numbers are allowed for the <code><from></code> and <code><to></code> arguments.

When <code><from></code> is greater than <code><to></code>, their values will be exchanged accordingly.

For instance,

<geshi lang="nginx">
    location /test {
        set $from 5;                              
        set $to 7;                                
        set_random $res $from $to;                
                                                  
        echo $res;                                
    }
</geshi>

then request <code>GET /test</code> will output a number between 5 and 7 (i.e., among 5, 6, 7).

For now, there's no way to configure a custom random generator seed.

Behind the scene, it makes use of the standard C function <code>rand()</code>.

This directive was first introduced in the <code>v0.22rc1</code> release.

See also [[#set_secure_random_alphanum|set_secure_random_alphanum]] and [[#set_secure_random_lcalpha|set_secure_random_lcalpha]].

== set_secure_random_alphanum ==
'''syntax:''' ''set_secure_random_alphanum $res <length>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Generates a cryptographically-strong random string <code><length></code> characters long with the alphabet <code>[a-zA-Z0-9]</code>.

<code><length></code> may be between 1 and 64, inclusive.

For instance,

<geshi lang="nginx">
    location /test {
        set_secure_random_alphanum $res 32;

        echo $res;
    }
</geshi>

then request <code>GET /test</code> will output a string like <code>ivVVRP2DGaAqDmdf3Rv4ZDJ7k0gOfASz</code>.

This functionality depends on the presence of the <code>/dev/urandom</code> device, available on most UNIX-like systems.

See also [[#set_secure_random_lcalpha|set_secure_random_lcalpha]] and [[#set_random|set_random]].

This directive was first introduced in the <code>v0.22rc8</code> release.

== set_secure_random_lcalpha ==
'''syntax:''' ''set_secure_random_lcalpha $res <length>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Generates a cryptographically-strong random string <code><length></code> characters long with the alphabet <code>[a-z]</code>.

<code><length></code> may be between 1 and 64, inclusive.

For instance,

<geshi lang="nginx">
    location /test {
        set_secure_random_lcalpha $res 32;

        echo $res;
    }
</geshi>

then request <code>GET /test</code> will output a string like <code>kcuxcddktffsippuekhshdaclaquiusj</code>.

This functionality depends on the presence of the <code>/dev/urandom</code> device, available on most UNIX-like systems.

This directive was first introduced in the <code>v0.22rc8</code> release.

See also [[#set_secure_random_alphanum|set_secure_random_alphanum]] and [[#set_random|set_random]].

== set_rotate ==
'''syntax:''' ''set_rotate $value <from> <to>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Increments <code>$value</code> but keeps it in range from <code><from></code> to <code><to></code>. 
If <code>$value</code> is greater than <code><to></code> or less than <code><from></code> is will be 
set to <code><from></code> value.

The current value after running this directive will always be saved on a per-location basis. And the this saved value will be used for incrementation when the <code>$value</code> is not initialized or has a bad value.

Only non-negative numbers are allowed for the <code><from></code> and <code><to></code> arguments.

When <code><from></code> is greater than <code><to></code>, their values will be exchanged accordingly.

For instance,

<geshi lang="nginx">
    location /rotate {
        default_type text/plain;
        set $counter $cookie_counter;
        set_rotate $counter 1 5;
        echo $counter;
        add_header Set-Cookie counter=$counter;
    }
</geshi>

then request <code>GET /rotate</code> will output next number between 1 and 5 (i.e., 1, 2, 3, 4, 5) on each
refresh of the page. This directive may be userful for banner rotation purposes.

Another example is to use server-side value persistence to do simple round-robin:

<geshi lang="nginx">
    location /rotate {
        default_type text/plain;
        set_rotate $counter 0 3;
        echo $counter;
    }
</geshi>

And accessing <code>/rotate</code> will also output integer sequence 0, 1, 2, 3, 0, 1, 2, 3, and so on.

This directive was first introduced in the <code>v0.22rc7</code> release.

== set_local_today ==
'''syntax:''' ''set_local_today $dst''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Set today's date ("yyyy-mm-dd") in localtime to the argument variable <code>$dst</code>.

Here's an example,

<geshi lang="nginx">
    location /today {
        set_local_today $today;
        echo $today;
    }
</geshi>

then request <code>GET /today</code> will output something like

<geshi lang="text">
2011-08-16
</geshi>

and year, the actual date you get here will vary every day ;)

Behind the scene, this directive utilizes the <code>ngx_time</code> API in the Nginx core, so usually no syscall is involved due to the time caching mechanism in the Nginx core.

== set_formatted_gmt_time ==
'''syntax:''' ''set_formatted_gmt_time $res &lt;time-format&gt;''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Set a formatted GMT time to variable <code>$res</code> (as the first argument) using the format string in the second argument.

All the conversion specification notations in the standard C function <code>strftime</code> are supported, like <code>%Y</code> (for 4-digit years) and <code>%M</code> (for minutes in decimal). See http://linux.die.net/man/3/strftime for a complete list of conversion specification symbols.

Below is an example:

<geshi lang="nginx">
    location = /t {
        set_formatted_gmt_time $timestr "%a %b %e %H:%M:%S %Y GMT";
        echo $timestr;
    }
</geshi>

Accessing <code>/t</code> yields the output

    Fri Dec 13 15:34:37 2013 GMT

This directive was first added in the <code>0.23</code> release.

See also [[#set_formatted_local_time|set_formatted_local_time]].

== set_formatted_local_time ==
'''syntax:''' ''set_formatted_local_time $res &lt;time-format&gt;''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''rewrite''

Set a formatted local time to variable <code>$res</code> (as the first argument) using the format string in the second argument.

All the conversion specification notations in the standard C function <code>strftime</code> are supported, like <code>%Y</code> (for 4-digit years) and <code>%M</code> (for minutes in decimal). See http://linux.die.net/man/3/strftime for a complete list of conversion specification symbols.

Below is an example:

<geshi lang="nginx">
    location = /t {
        set_formatted_local_time $timestr "%a %b %e %H:%M:%S %Y %Z";
        echo $timestr;
    }
</geshi>

Accessing <code>/t</code> yields the output

    Fri Dec 13 15:42:15 2013 PST

This directive was first added in the <code>0.23</code> release.

See also [[#set_formatted_gmt_time|set_formatted_gmt_time]].

= Caveats =

Do not use [[HttpCoreModule#$arg_PARAMETER|$arg_PARAMETER]], [[HttpCoreModule#$cookie_COOKIE|$cookie_COOKIE]], [[HttpCoreModule#$http_HEADER|$http_HEADER]] or other special variables defined in the Nginx core module as the target variable in this module's directives. For instance,

<geshi lang="nginx">
    set_if_empty $arg_user 'foo';  # DO NOT USE THIS!
</geshi>

may lead to segmentation faults.

= Installation =

This module is included and enabled by default in the [http://openresty.org ngx_openresty bundle]. If you want to install this module manually with your own Nginx source tarball, then follow the steps below:

Grab the nginx source code from [http://nginx.org/ nginx.org], for example,
the version 1.7.7 (see [[#Compatibility|nginx compatibility]]), and then build the source with this module:

<geshi lang="bash">
    wget 'http://nginx.org/download/nginx-1.7.7.tar.gz'
    tar -xzvf nginx-1.7.7.tar.gz
    cd nginx-1.7.7/
    
    # Here we assume you would install you nginx under /opt/nginx/.
    ./configure --prefix=/opt/nginx \
        --with-http_ssl_module \
        --add-module=/path/to/ngx_devel_kit \
        --add-module=/path/to/set-misc-nginx-module
    
    make -j2
    make install
</geshi>

Download the latest version of the release tarball of this module from [http://github.com/openresty/set-misc-nginx-module/tags set-misc-nginx-module file list], and the latest tarball for [https://github.com/simpl/ngx_devel_kit ngx_devel_kit] from its [https://github.com/simpl/ngx_devel_kit/tags file list].

Also, this module is included and enabled by default in the [http://openresty.org/ ngx_openresty bundle].

= Compatibility =

The following versions of Nginx should work with this module:

* '''1.7.x'''                       (last tested: 1.7.7)
* '''1.6.x'''
* '''1.5.x'''                       (last tested: 1.5.8)
* '''1.4.x'''                       (last tested: 1.4.4)
* '''1.2.x'''                       (last tested: 1.2.9)
* '''1.1.x'''                       (last tested: 1.1.5)
* '''1.0.x'''                       (last tested: 1.0.15)
* '''0.9.x'''                       (last tested: 0.9.4)
* '''0.8.x'''                       (last tested: 0.8.54)
* '''0.7.x >= 0.7.46'''             (last tested: 0.7.68)

If you find that any particular version of Nginx above 0.7.46 does not work with this module, please consider [[#Report Bugs|reporting a bug]].

= Report Bugs =

Although a lot of effort has been put into testing and code tuning, there must be some serious bugs lurking somewhere in this module. So whenever you are bitten by any quirks, please don't hesitate to

# send a bug report or even patches to the [https://groups.google.com/group/openresty-en openresty-en mailing list],
# or create a ticket on the [http://github.com/openresty/set-misc-nginx-module/issues issue tracking interface] provided by GitHub.

= Source Repository =

Available on github at [http://github.com/openresty/set-misc-nginx-module openresty/set-misc-nginx-module].

= Changes =

The change logs for every release of this module can be obtained from the ngx_openresty bundle's change logs:

http://openresty.org/#Changes

= Test Suite =

This module comes with a Perl-driven test suite. The [http://github.com/openresty/set-misc-nginx-module/tree/master/t/ test cases] are
[http://github.com/openresty/set-misc-nginx-module/blob/master/t/escape-uri.t declarative] too. Thanks to the [http://search.cpan.org/perldoc?Test::Nginx Test::Nginx] module in the Perl world.

To run it on your side:

<geshi lang="bash">
    $ PATH=/path/to/your/nginx-with-set-misc-module:$PATH prove -r t
</geshi>

You need to terminate any Nginx processes before running the test suite if you have changed the Nginx server binary.

Because a single nginx server (by default, <code>localhost:1984</code>) is used across all the test scripts (<code>.t</code> files), it's meaningless to run the test suite in parallel by specifying <code>-jN</code> when invoking the <code>prove</code> utility.

= Getting involved =

You'll be very welcomed to submit patches to the [[#Author|author]] or just ask for a commit bit to the [[#Source Repository|source repository]] on GitHub.

= Author =

Yichun Zhang (agentzh) ''<agentzh@gmail.com>'', CloudFlare Inc.

This wiki page is also maintained by the author himself, and everybody is encouraged to improve this page as well.

= Copyright & License =

Copyright (C) 2009-2015, Yichun Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

This module is licensed under the terms of the BSD license.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

= See Also =
* [https://github.com/simpl/ngx_devel_kit Nginx Devel Kit]
* [http://openresty.org The ngx_openresty bundle]
