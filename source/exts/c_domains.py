import sphinx

# Added va_list, off_t, uint32_t, uintptr_t standard types
# cmp, compare are not standard types but we need to ignore
STANDARD_TYPES = set((
        'const', 'void', 'char', 'wchar_t', 'int', 'short',
        'long', 'float', 'double', 'unsigned', 'signed', 'FILE',
        'clock_t', 'time_t', 'ptrdiff_t', 'size_t', 'ssize_t',
        'struct', '_Bool', 'va_list', 'off_t', 'uint32_t',
        'uintptr_t',
        'cmp', 'compar'
        ))

def setup(app):

    sphinx.domains.c.CObject.stopwords = STANDARD_TYPES
