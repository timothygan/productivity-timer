On running my second prompt, I got a out of memory error that caused claude to crash haha:

```bash
<--- Last few GCs --->

[48324:0x128008000]  3837051 ms: Scavenge (interleaved) 4053.2 (4084.9) -> 4047.8 (4122.9) MB, pooled: 0 MB, 18.58 / 0.00 ms  (average mu = 0.269, current mu = 0.286) allocation failure; 
[48324:0x128008000]  3837641 ms: Mark-Compact (reduce) 4078.9 (4126.4) -> 4058.3 (4076.2) MB, pooled: 0 MB, 560.79 / 0.00 ms  (+ 2.8 ms in 495 steps since start of marking, biggest step 2.0 ms, walltime since start of marking 590 ms) (average mu = 0.240, 
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----

 1: 0x104e7e164 node::OOMErrorHandler(char const*, v8::OOMDetails const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 2: 0x104fafa5c v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 3: 0x104fafa14 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 4: 0x10518c99c v8::internal::Heap::stack() [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 5: 0x10518f0dc v8::internal::Heap::OldGenerationConsumedBytes() const [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 6: 0x10518ef7c v8::internal::Heap::RecomputeLimits(v8::internal::GarbageCollector, v8::base::TimeTicks) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 7: 0x10519c908 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags)::$_1::operator()() const [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 8: 0x10519c5ac void heap::base::Stack::SetMarkerAndCallbackImpl<v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags)::$_1>(heap::base::Stack*, void*, void const*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
 9: 0x1058e4d20 PushAllRegistersAndIterateStack [/opt/homebrew/Cellar/node/24.4.0/bin/node]
10: 0x10518af5c v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
11: 0x105182b64 v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
12: 0x10516a7f0 v8::internal::Factory::NewFillerObject(int, v8::internal::AllocationAlignment, v8::internal::AllocationType, v8::internal::AllocationOrigin) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
13: 0x1054dd500 v8::internal::Runtime_AllocateInYoungGeneration(int, unsigned long*, v8::internal::Isolate*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
14: 0x1059a5f74 Builtins_CEntry_Return1_ArgvOnStack_NoBuiltinExit [/opt/homebrew/Cellar/node/24.4.0/bin/node]
15: 0x1406d60ac 
16: 0x1405bc8ac 
17: 0x140635788 
18: 0x14058ccb4 
19: 0x140c31a84 
20: 0x14099add0 
21: 0x1408c31a0 
22: 0x1408f0224 
23: 0x1405c00f4 
24: 0x140873f90 
25: 0x105947648 Builtins_AsyncFunctionAwaitResolveClosure [/opt/homebrew/Cellar/node/24.4.0/bin/node]
26: 0x105a1c5f8 Builtins_PromiseFulfillReactionJob [/opt/homebrew/Cellar/node/24.4.0/bin/node]
27: 0x105936a50 Builtins_RunMicrotasks [/opt/homebrew/Cellar/node/24.4.0/bin/node]
28: 0x1059067b0 Builtins_JSRunMicrotasksEntry [/opt/homebrew/Cellar/node/24.4.0/bin/node]
29: 0x1050e4bf8 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
30: 0x1050e52a4 v8::internal::(anonymous namespace)::InvokeWithTryCatch(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
31: 0x1050e5394 v8::internal::Execution::TryRunMicrotasks(v8::internal::Isolate*, v8::internal::MicrotaskQueue*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
32: 0x105109f90 v8::internal::MicrotaskQueue::RunMicrotasks(v8::internal::Isolate*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
33: 0x105109dac v8::internal::MicrotaskQueue::PerformCheckpointInternal(v8::Isolate*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
34: 0x10590a94c Builtins_CallApiCallbackOptimizedNoProfiling [/opt/homebrew/Cellar/node/24.4.0/bin/node]
35: 0x14086ecfc 
36: 0x1059068cc Builtins_JSEntryTrampoline [/opt/homebrew/Cellar/node/24.4.0/bin/node]
37: 0x105906570 Builtins_JSEntry [/opt/homebrew/Cellar/node/24.4.0/bin/node]
38: 0x1050e4c28 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
39: 0x1050e4618 v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::DirectHandle<v8::internal::Object>, v8::internal::DirectHandle<v8::internal::Object>, v8::base::Vector<v8::internal::DirectHandle<v8::internal::Object> const>) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
40: 0x104fc0f48 v8::Function::Call(v8::Isolate*, v8::Local<v8::Context>, v8::Local<v8::Value>, int, v8::Local<v8::Value>*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
41: 0x104dcc970 node::InternalCallbackScope::Close() [/opt/homebrew/Cellar/node/24.4.0/bin/node]
42: 0x104dccbb0 node::InternalMakeCallback(node::Environment*, v8::Local<v8::Object>, v8::Local<v8::Object>, v8::Local<v8::Function>, int, v8::Local<v8::Value>*, node::async_context, v8::Local<v8::Value>) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
43: 0x104ddb928 node::AsyncWrap::MakeCallback(v8::Local<v8::Function>, int, v8::Local<v8::Value>*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
44: 0x104f38228 node::StreamBase::CallJSOnreadMethod(long, v8::Local<v8::ArrayBuffer>, unsigned long, node::StreamBase::StreamBaseJSChecks) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
45: 0x104f397d8 node::EmitToJSStreamListener::OnStreamRead(long, uv_buf_t const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
46: 0x104f9469c node::crypto::TLSWrap::ClearOut() [/opt/homebrew/Cellar/node/24.4.0/bin/node]
47: 0x104f93b34 node::crypto::TLSWrap::Cycle() [/opt/homebrew/Cellar/node/24.4.0/bin/node]
48: 0x104f962ec node::crypto::TLSWrap::OnStreamRead(long, uv_buf_t const&) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
49: 0x104f3bf9c node::LibuvStreamWrap::OnUvRead(long, uv_buf_t const*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
50: 0x104f3c458 node::LibuvStreamWrap::ReadStart()::$_1::__invoke(uv_stream_s*, long, uv_buf_t const*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
51: 0x10a327af0 uv__stream_io [/opt/homebrew/Cellar/libuv/1.51.0/lib/libuv.1.dylib]
52: 0x10a32eca8 uv__io_poll [/opt/homebrew/Cellar/libuv/1.51.0/lib/libuv.1.dylib]
53: 0x10a31eb58 uv_run [/opt/homebrew/Cellar/libuv/1.51.0/lib/libuv.1.dylib]
54: 0x104dcd3ec node::SpinEventLoopInternal(node::Environment*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
55: 0x104ea7f38 node::NodeMainInstance::Run(node::ExitCode*, node::Environment*) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
56: 0x104ea7ccc node::NodeMainInstance::Run() [/opt/homebrew/Cellar/node/24.4.0/bin/node]
57: 0x104e53808 node::Start(int, char**) [/opt/homebrew/Cellar/node/24.4.0/bin/node]
58: 0x193054274 start [/usr/lib/dyld]
zsh: abort      claude

```
oops.