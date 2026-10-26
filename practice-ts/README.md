# Practice TS — cách chạy

Repo này đã cài sẵn `typescript` + `ts-node` + `@types/node`.

```bash
# 1) Chạy một bài (transpile-only, khởi động nhanh)
npm run practice:ts -- practice-ts/ex01_basic-types.ts

# 2) Kiểm tra kiểu cho TOÀN BỘ bài (không phát sinh file)
npm run practice:ts:check
```

Cách khác nếu muốn tự gõ:

```bash
node --no-warnings --loader ts-node/esm/transpile-only practice-ts/ex04_generics.ts
npx tsc -p practice-ts --noEmit
```

Thư mục dùng tsconfig riêng (`practice-ts/tsconfig.json`) kế thừa tsconfig gốc:
`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`verbatimModuleSyntax` đều đang BẬT, nên nhiều dòng comment "LỖI:" trong bài
là thật — bạn có thể bỏ comment để xem compiler báo gì.

| Bài | Nội dung |
|---|---|
| ex01 | primitive, inference, array/tuple, enum, any/unknown/never |
| ex02 | interface vs type, optional, readonly, index signature, merging |
| ex03 | kiểu hàm, overload, type predicate, this có kiểu |
| ex04 | generics: constraint, class generic, keyof constraint |
| ex05 | union, literal, discriminated union, exhaustiveness (never) |
| ex06 | narrowing: typeof/instanceof/in, guard, asserts |
| ex07 | tuple, as const, excess property, noUncheckedIndexedAccess, Record |
| ex08 | optional vs undefined (exactOptionalPropertyTypes), delete, build options |
| ex09 | numeric/string enum, bit flag, as const object thay thế |
| ex10 | class: modifier, parameter property, abstract, generic class, static |
| ex11 | utility types: Partial/Pick/Omit/Record/Exclude/Awaited/Parameters... |
| ex12 | as, as unknown as, non-null !, satisfies, as const |
| ex13 | mapped type, conditional + infer, template literal type, recursive |
| ex14 | strict mode thực chiến: Map/Record | undefined, validate unknown |
| ex15 | module & import type, re-export, declare global (shared-types/) |
| ex16 | mini project 1: API client có kiểu, Result union, retry/timeout |
| ex17 | mini project 2: Todo store (generic + event union + guard + async) |
