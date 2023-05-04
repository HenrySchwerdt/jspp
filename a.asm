section .data
    msg db '10', 0x0a

section .text
    global _start

    ; function to print a number to stdout
    my_print_function:
        push rbp
        mov rbp, rsp

        ; convert the integer argument to a string
        mov eax, edi
        mov ebx, 10      ; divide by 10 to extract each digit
        xor ecx, ecx     ; initialize the digit counter
        cmp eax, 0       ; handle negative numbers
        jge .convert_loop
        neg eax
        mov byte [msg], byte '-'    ; set the sign to negative
        inc ecx

    .convert_loop:
        xor edx, edx     ; clear the high 32 bits of the dividend
        div ebx          ; divide eax by ebx (10)
        add dl, '0'       ; convert the digit to a character
        mov byte [msg + ecx], dl  ; store the character in the buffer
        inc ecx          ; increment the digit counter
        test eax, eax    ; continue until eax = 0
        jnz .convert_loop

        ; print the string to stdout
        mov eax, 1       ; write system call
        mov ebx, 1       ; stdout file descriptor
        mov ecx, msg     ; pointer to the message
        mov edx, 2     ; length of the message
        mov eax, 0x2000004 ; syscall write
        syscall         ; invoke the system call

        ; clean up the stack
        pop rbp
        ret

    _start:
        ; call the print function with the argument 10
        mov edi, 10
        call my_print_function

        ; exit the program
        mov eax, 60      ; exit system call
        xor edi, edi     ; exit status
        syscall
