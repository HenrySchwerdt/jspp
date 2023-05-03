const offsets = {
    'i8': 1,
    'i16': 2,
    'i32': 4,
    'i64': 8
}
const types = {
    'i8': 'BYTE',
    'i16': 'WORD',
    'i32': 'DWORD',
    'i64': 'QWORD'
}
module.exports = {
    offsets,
    types,
    dumpF(write) {
        write("dump:")
        write("   mov   r9, -3689348814741910323")
        write("   sub   rsp, 40")
        write("   mov   BYTE [rsp+31], 10")
        write("   lea   rcx, [rsp+30]")
        write(".L2:")
        write("   mov   rax, rdi")
        write("   lea   r8, [rsp+32]")
        write("   mul   r9")
        write("   mov   rax, rdi")
        write("   sub   r8, rcx")
        write("   shr   rdx, 3")
        write("   lea   rsi, [rdx+rdx*4]")
        write("   add   rsi, rsi")
        write("   sub   rax, rsi")
        write("   add   eax, 48")
        write("   mov   BYTE [rcx], al")
        write("   mov   rax, rdi")
        write("   mov   rdi, rdx")
        write("   mov   rdx, rcx")
        write("   sub   rcx, 1")
        write("   cmp   rax, 9")
        write("   ja    .L2")
        write("   lea   rax, [rsp+32]")
        write("   mov   edi, 1")
        write("   sub   rdx, rax")
        write("   xor   eax, eax")
        write("   lea   rsi, [rsp+32+rdx]")
        write("   mov   rdx, r8")
        write("   mov   rax, 1")
        write("   syscall")
        write("   add   rsp, 40")
        write("   ret")
    },
    quitF(write, exitCode) {
        write("quit:")
        write("   mov rax, 60")
        write(`   mov rdi, ${exitCode}`)
        write("   syscall")
    },
    plus(write) {
        write("   pop   rax")
        write("   pop   rbx")
        write("   add   rax, rbx")
        write("   push  rax")
    },
    minus(write) {
        write("   pop   rax")
        write("   pop   rbx")
        write("   sub   rbx, rax")
        write("   push  rbx")
    },
    equal(write) {
        write("   mov rcx, 0")
        write("   mov rdx, 1")
        write("   pop rax")
        write("   pop rbx")
        write("   cmp rax, rbx")
        write("   cmove rcx, rdx")
    },
    push(write, value) {
        write(`   push  ${value}`)
    },
    dump(write) {
        write("   pop   rdi")
        write("   call  dump")
    },
    print(write, basePointerOffset) {
        write(`   mov edi, [rbp${basePointerOffset}]`)
        write("   call dump")
    },
    quit(write) {
        write("   call  quit")
    },
    segment(write, name) {
        write("BITS 64")
        write(`segment ${name}`);
    },
    entry(write) {
        write("global _start");
        write("_start:");
    },
    startFn(write) {
        write("   push rbp");
        write("   mov  rbp, rsp");
    },
    endFn(write) {
        write("   pop rdp")
        write("   ret")
    },
    addVariable(write, basePointerOffset, num, type) {
        write(`   mov ${types[type]} [rbp${basePointerOffset}], ${num}`)
    }




}