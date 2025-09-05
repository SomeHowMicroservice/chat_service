proto-gen:
	npx protoc \
		--ts_proto_out=src/protobuf/chat \
		--ts_proto_opt=nestJs=true,outputServices=grpc-js \
		-I=src/proto \
		src/proto/chat.proto