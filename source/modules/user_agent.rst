User Agent
==========

= Syntax =

<geshi lang="nginx">
user_agent $variable_name {
    greedy        name;

    name [([+|-]version) | (version1~version2)]  value;
}

if ($variable == value) {
    echo hello;
}
</geshi>


= Directives =

== greedy ==
We specify the keyword in the user_agent string from right to left, and this is more efficient. As usual, we use the greedy algorithm. It will return immediately after the keyword being found.

E.g 1. "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)", this string is MSIE's user_agent string, we will return when we find the keyword "MSIE". But the truth is not alway like this:
E.g 2. "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20", This is Chrome's user_agent. We will match Safari frist. If we define safari is greedy, it scans the string in a reverse order. If a keyword is greedy, it will not return when it matches the keyword at the first time. It will continue to scan the string.

== default ==
set the default value of this variable;

The directive format is like this in the block:
name   version    value;

name: the name of operating_system, browser, crawler and so on;
version: It can be omitted, and it support multiple formats;
value: It is the value filled to the variable;

for example:

<geshi lang="nginx">
user_agent $example {

    #set default value
    default                                             msie;

    #define safari is greedy
    greedy                                             safari;

    #match exact version
    msie                6.0                             1;

    #match interval
    msie                7.0~8.0                         2;

    #match greater than version 9.0
    msie                9.0+                            3;

    #match less than version 4.0 (include 4.0)
    msie                4.0-                            4;

    #match all
    Chrome                                              5;
}
</geshi>
